import { Dialog, DialogTitle, TextField, useMediaQuery } from "@mui/material";
import React, { useState, useContext } from "react";
import "./Login.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";
import { UserContext } from "../../App";

const Login = ({ LoginDialogOpen, setLoginDialogOpen }) => {
  const { state, dispatch } = useContext(UserContext);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState("");

  const SubmitLoginDetails = async (e) => {
    e.preventDefault();

    if (password.length <= 5) {
      return setError(
        {
          password: "Password must be of 5 length!!",
        },
        { ...error }
      );
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return setError(
        {
          email: "Please enter a valid email!!",
        },
        { ...error }
      );
    }

    const data = { password, email };
    try {
      const res = await axios.post(
        "https://plantstory-backend.onrender.com/signin",
        data
      );
      setLoginDialogOpen(false);
      Swal.fire(
        "Logged In 😄",
        "Continuing a Plant Story or you have a new one 😉",
        "success"
      );
      console.log(res);
      localStorage.setItem("jwt", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      dispatch({ type: "USER", payload: res.data.user });
    } catch (err) {
      console.log(err);
      setLoginError(err?.response?.data?.error);
    }
  };

  const fullScreen = useMediaQuery("(max-width:48rem)");

  const handleClose = () => {
    setLoginDialogOpen(false);
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={LoginDialogOpen}
      onClose={handleClose}
      fullWidth={true}
      fullHeight={true}
    >
      <CloseIcon onClick={() => handleClose()} className="closeIcon" />
      <DialogTitle>
        <h1 className="heading">Login</h1>
      </DialogTitle>

      <div className="LoginCard">
        <p className="loginError">{loginError}</p>
        <form onSubmit={SubmitLoginDetails}>
          <TextField
            type="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            className="LoginCard__input"
            variant="filled"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error.email ? true : false}
            helperText={error.email ? error.email : ""}
          />
          <br />
          <br />
          <br />
          <TextField
            type="password"
            label="Password"
            className="LoginCard__input"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password ? true : false}
            helperText={error.password ? error.password : ""}
          />
          <br />
          <button className="LoginCard__button">Login</button>
        </form>
      </div>
    </Dialog>
  );
};

export default Login;

import { Dialog, DialogTitle, TextField, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./SignUp.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";

const SignUp = ({ SignupDialogOpen, setSignupDialogOpen }) => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileUrl, setProfileUrl] = useState(undefined);
  const [email, setEmail] = useState("");
  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [signUpError, setSignUpError] = useState("");

  useEffect(() => {
    if (profileUrl) {
      uploadFields();
    }
  }, [profileUrl]);

  const UploadProfilePic = async () => {
    try {
      const data = new FormData();
      data.append("file", profileImage);
      data.append("upload_preset", "PlantStory");
      data.append("cloud_name", "vikaskumar1234567");
      const ImageUploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/vikaskumar1234567/image/upload",
        data
      );
      setProfileUrl(ImageUploadResponse.data.url);
    } catch (err) {
      return console.log(err);
    }
  };

  const uploadFields = async () => {
    if (name.length < 3) {
      return setError(
        {
          name: "Name must be greater than 2 characters!!",
        },
        { ...error }
      );
    }

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

    const data = { name, password, email, profilePic: profileUrl };

    try {
      const res = await axios.post(
        "https://plantstory-backend.onrender.com/signup",
        data
      );

      setSignupDialogOpen(false);
      Swal.fire(
        "Registered 😄",
        "You are on path of saving a Plant",
        "success"
      );
      console.log(res);
    } catch (err) {
      console.log(err);
      setSignUpError(err.response.data.error);
    }
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (profileImage) {
      UploadProfilePic();
    } else {
      uploadFields();
    }
  };

  // material ui for responsive modal
  const fullScreen = useMediaQuery("(max-width:48rem)");

  const handleClose = () => {
    setSignupDialogOpen(false);
  };
  return (
    <Dialog
      fullScreen={fullScreen}
      open={SignupDialogOpen}
      onClose={handleClose}
      fullWidth={true}
      fullHeight={true}
    >
      <CloseIcon onClick={() => handleClose()} className="closeIcon" />

      <DialogTitle>
        <h1 className="heading">Sign Up</h1>
      </DialogTitle>
      <div className="SignupCard">
        <p className="signUpError">{signUpError}</p>
        <form onSubmit={SubmitData}>
          <TextField
            type="text"
            label="Name"
            placeholder="john doe"
            className="SignupCard__input"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error.name ? true : false}
            helperText={error.name ? error.name : ""}
          />
          <br />
          <br />
          <br />
          <TextField
            type="email"
            label="Email"
            placeholder="johndoe@gmail.com"
            className="SignupCard__input"
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
            className="SignupCard__input"
            variant="filled"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password ? true : false}
            helperText={error.password ? error.password : ""}
          />
          <br />
          <br />
          <br />
          <TextField
            type="file"
            placeholder="Image"
            variant="filled"
            className="CreatePost__input"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />

          <br />
          <button type="submit" className="SignupCard__button">
            Sign Up
          </button>
        </form>
      </div>
    </Dialog>
  );
};

export default SignUp;

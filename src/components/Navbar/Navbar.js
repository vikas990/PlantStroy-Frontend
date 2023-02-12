import React, { useState, useContext } from "react";
import "./Navbar.css";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import CreatePost from "../CreatePost/CreatePost";
import Login from "../Login/Login";
import SignUp from "../SignUp/SignUp";
import { UserContext } from "../../App";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  // mobile navbar
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  // Responsive dialog box states
  // Create Post states
  const [CreatePostDialogOpen, setCreatePostDialogOpen] = useState(false);
  // Login states
  const [LoginDialogOpen, setLoginDialogOpen] = useState(false);
  // Signup states
  const [SignupDialogOpen, setSignupDialogOpen] = useState(false);

  const { state, dispatch } = useContext(UserContext);
  const renderList = () => {
    if (state) {
      return [
        <li>
          <Link to="/profile" onClick={() => setIsDrawerOpen(false)}>
            Profile
          </Link>
        </li>,
        <li>
          <Link to="/myFollowersPost" onClick={() => setIsDrawerOpen(false)}>
            Followers Post
          </Link>
        </li>,
        <li onClick={() => setCreatePostDialogOpen(true)}>CreatePost</li>,
        <li
          onClick={() => {
            localStorage.clear();
            dispatch({ type: "CLEAR" });
            navigate("/");
          }}
        >
          Logout
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/">Home</Link>
        </li>,
        <li onClick={() => setLoginDialogOpen(true)}>Login</li>,
        <li onClick={() => setSignupDialogOpen(true)}>SignUp</li>,
      ];
    }
  };

  return (
    <div className="Container">
      <div className="NavContainer">
        {/* Menu Icon */}
        <div className="menu">
          <IconButton
            size="large"
            edge="start"
            onClick={() => setIsDrawerOpen(true)}
          >
            <MenuIcon className="menuIcon" />
          </IconButton>
          {/* Mobile Navbar start */}

          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            PaperProps={{
              sx: { width: "30%", backgroundColor: "#0f4c37" },
            }}
          >
            <IconButton
              size="large"
              edge="start"
              onClick={() => setIsDrawerOpen(false)}
            >
              <CloseIcon className="closeIcon" />
            </IconButton>
            <ul className="drawer">{renderList()}</ul>
          </Drawer>
        </div>
        {/* Mobile Navbar End */}
        <h1 className="logo">
          <Link to="/">PlantStory</Link>
        </h1>
        <ul className="NavContainer__links">{renderList()}</ul>
      </div>
      <div>
        <TextField
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="NavContainer__Input--icon" />
              </InputAdornment>
            ),
            className: "NavContainer__Input",
          }}
        />
        <CreatePost
          CreatePostDialogOpen={CreatePostDialogOpen}
          setCreatePostDialogOpen={setCreatePostDialogOpen}
        />
        <Login
          LoginDialogOpen={LoginDialogOpen}
          setLoginDialogOpen={setLoginDialogOpen}
        />
        <SignUp
          SignupDialogOpen={SignupDialogOpen}
          setSignupDialogOpen={setSignupDialogOpen}
        />
      </div>
    </div>
  );
};

export default Navbar;

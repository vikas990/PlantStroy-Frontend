import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import Profile from "./components/Profile/Profile";
import { createContext, useEffect, useReducer, useContext } from "react";
import { reducer, initialState } from "./reducer/userReducer";
import UserProfile from "./components/userProfile/UserProfile";
import FollowedUserPost from "./components/FollowedUserPost/FollowedUserPost";

export const UserContext = createContext();

const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/");
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route exact path="/profile" element={<Profile />} />
      <Route path="/profile/:userId" element={<UserProfile />} />
      <Route path="/myFollowersPost" element={<FollowedUserPost />} />
    </Routes>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

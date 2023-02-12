import React, { useEffect, useState, useContext } from "react";
import "./Profile.css";
import axios from "axios";
import { UserContext } from "../../App";
import { TextField } from "@mui/material";
import { metaTitle } from "../../../utils/MetaTitle";

const Profile = () => {
  metaTitle("Profile");
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [showEditField, setShowEditField] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [profileUrl, setProfileUrl] = useState(undefined);
  useEffect(() => {
    const getAllMyPostData = async () => {
      const res = await axios.get(
        "https://plantstory-backend.onrender.com/myPost",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );
      setData(res.data.myPosts);
    };
    getAllMyPostData();
  }, []);

  const UpdateProfilePic = async () => {
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

      const profileData = { profilePic: ImageUploadResponse.data.url };
      console.log(profileData);
      const res = await axios.put(
        "https://plantstory-backend.onrender.com/updatePic",
        profileData,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );
      localStorage.setItem(
        "user",
        JSON.stringify({ ...state, profilePic: res.data.profilePic })
      );
      dispatch({ action: "UPDATEPIC", payload: res.data.profilePic });
      // window.location.reload(false);
    } catch (err) {
      return console.log(err);
    }
  };

  return (
    <div className="mainContainer">
      <div className="ProfileContainer">
        <div>
          <img
            className="ProfileContainer__profileImage"
            src={state ? state.profilePic : "Loading"}
            alt="profile_img"
          />
          {!showEditField && (
            <button
              className="EditProfile__button"
              onClick={() => setShowEditField(!showEditField)}
            >
              Edit
            </button>
          )}
          <br />
          <br />
          <br />
          {showEditField && (
            <form>
              <TextField
                type="file"
                placeholder="Image"
                variant="filled"
                className="CreatePost__input"
                onChange={(e) => setProfileImage(e.target.files[0])}
              />
              <button
                className="EditProfile__button"
                onClick={() => {
                  UpdateProfilePic();
                  setShowEditField(!showEditField);
                }}
              >
                Edit
              </button>
            </form>
          )}
        </div>
        <div>
          <h1>{state ? state.name : "loading"}</h1>
          <h3>{state ? state.email : "loading"}</h3>
          <div className="ProfileContainer__AccountDetails">
            <h5>{data.length} posts</h5>
            <h5>{state ? state?.followers?.length : 0} followers</h5>
            <h5>{state ? state?.following?.length : 0} following</h5>
          </div>
        </div>
      </div>
      <div className="profileGallery">
        {data.map((d) => (
          <img
            className="profileGallery__Image"
            src={d.photo}
            alt="ProfileImages"
          />
        ))}
      </div>
    </div>
  );
};

export default Profile;

import React, { useEffect, useState, useContext } from "react";
import "./UserProfile.css";
import axios from "axios";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
import { metaTitle } from "../../../utils/MetaTitle";

const UserProfile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [userData, setUserData] = useState([]);
  const [userPost, setUserPost] = useState([]);
  const { userId } = useParams();
  const [isFollowed, setIsFollowed] = useState(
    state ? !state.following.includes(userId) : true
  );

  useEffect(() => {
    const getAllMyPostData = async () => {
      const res = await axios.get(
        `https://plantstory-backend.onrender.com/user/${userId}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );
      console.log(res);

      setUserData(res.data.user);
      setUserPost(res.data.post);
    };
    getAllMyPostData();
  }, []);

  const followUser = async () => {
    const data = { followId: userId };
    const res = await axios.put(
      "https://plantstory-backend.onrender.com/follow",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
    console.log(res);
    dispatch({
      type: "UPDATE",
      payload: { following: res.data.following, followers: res.data.followers },
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    setUserData({
      ...userData,
      followers: [...userData.followers, res.data._id],
    });
    setIsFollowed(false);
  };

  const unfollowUser = async () => {
    const data = { unfollowId: userId };
    const res = await axios.put(
      "https://plantstory-backend.onrender.com/unfollow",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
    console.log(res);
    dispatch({
      type: "UPDATE",
      payload: { following: res.data.following, followers: res.data.followers },
    });
    localStorage.setItem("user", JSON.stringify(res.data));
    const newFollower = [
      ...userData.followers.filter((item) => item != res.data._id),
    ];
    setUserData({
      ...userData,
      followers: newFollower,
    });
    setIsFollowed(true);
  };

  metaTitle(userData.name);

  return (
    <div className="mainContainer">
      <div className="ProfileContainer">
        <div>
          <img
            className="ProfileContainer__profileImage"
            src={userData?.profilePic}
            alt="profile_img"
          />
        </div>
        <div>
          <h1>{userData ? userData.name : "loading"}</h1>
          <h4>{userData ? userData.email : "loading"}</h4>
          <div className="ProfileContainer__AccountDetails">
            <h5>{userPost.length} posts</h5>
            <h5>{userData?.followers?.length} followers</h5>
            <h5>{userData?.following?.length} following</h5>
          </div>
          {isFollowed ? (
            <button
              className="ProfileFollow__button"
              onClick={() => followUser()}
            >
              Follow
            </button>
          ) : (
            <button
              className="ProfileUnFollow__button"
              onClick={() => unfollowUser()}
            >
              Unfollow
            </button>
          )}
        </div>
      </div>
      <div className="profileGallery">
        {userPost.map((d) => (
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

export default UserProfile;

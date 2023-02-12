import { IconButton, TextField } from "@mui/material";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import ParkIcon from "@mui/icons-material/Park";
import React, { useEffect, useState, useContext } from "react";
import "./FollowedUserPost.css";
import axios from "axios";
import { UserContext } from "../../App";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { metaTitle } from "../../../utils/MetaTitle";

const FollowedUserPost = () => {
  metaTitle("Followers Post");
  const { state, dispatch } = useContext(UserContext);
  const [followersData, setFollowersData] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [error, setError] = useState({
    comment: "",
  });

  useEffect(() => {
    const getFollowersAllPostData = async () => {
      const res = await axios.get(
        "https://plantstory-backend.onrender.com/fetchFollowersAllPost",
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        }
      );
      setFollowersData(res.data.posts);
      console.log(">>>>>", res.data.posts);
    };
    getFollowersAllPostData();
  }, []);

  const likePost = async (postId, userId) => {
    setIsLiked(!isLiked);
    const data = { postId, userId };
    const res = await axios.put(
      "https://plantstory-backend.onrender.com/like",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
  };

  const commentOnPost = async (postId, comment) => {
    const data = { postId, comment };
    if (comment === "") {
      return setError(
        {
          comment: "You need to enter a comment 😄",
        },
        { ...error }
      );
    }
    const res = await axios.put(
      "https://plantstory-backend.onrender.com/comment",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
  };

  const DeletePost = async (postId) => {
    const res = await axios.delete(
      `https://plantstory-backend.onrender.com/deletePost/${postId}`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
    Swal.fire("Post Delete", res.data.message, "success");
    const newData = followersData.filter((item) => {
      return item._id !== res.data.result._id;
    });
  };

  const DeleteComment = async (postId, commentId) => {
    const data = { postId, commentId };
    const res = await axios.put(
      "https://plantstory-backend.onrender.com/deleteComment",
      data,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }
    );
    console.log(res);
  };

  return (
    <div className="followersHomeContainer">
      {followersData.map((d) => (
        <div className="followersHomeContainer__card" key={d._id}>
          <h1>
            <Link
              to={
                d.postedBy._id !== state?._id
                  ? `/profile/${d.postedBy._id}`
                  : "/profile"
              }
              className="followerPostName"
            >
              {" "}
              {d.postedBy.name}
            </Link>{" "}
            {d.postedBy._id === state?._id && (
              <IconButton
                size="large"
                edge="end"
                style={{ float: "right", color: "red" }}
                onClick={() => DeletePost(d._id)}
              >
                <DeleteIcon />
              </IconButton>
            )}
          </h1>
          <img src={d.photo} alt="cardImage" />
          <IconButton
            size="large"
            edge="start"
            onClick={() => {
              state
                ? likePost(d._id, state._id)
                : Swal.fire(
                    "Must Logging first",
                    "You must be logged in first to like a post",
                    "warning"
                  );
            }}
          >
            {d?.likes?.includes(state?._id) ? (
              <ParkIcon className="likeIcon" />
            ) : (
              <ParkOutlinedIcon className="likeIcon" />
            )}
            <span className="likeCount">{d.likes.length}</span>
          </IconButton>

          {/** Comment IconButton */}
          <IconButton size="large" edge="start">
            <AcUnitOutlinedIcon className="commentIcon" />
            <span className="likeCount">{d.comments.length}</span>
          </IconButton>
          <div className="homeContainer__card--Content">
            <h6>{d.title}</h6>
            <p>{d.body}</p>
            <p className="comment">Comment</p>
            {d.comments.map((comment) => (
              <p>
                <span>
                  <Link
                    to={
                      comment.postedBy._id !== state?._id
                        ? `/profile/${comment.postedBy._id}`
                        : "/profile"
                    }
                    className="commentName"
                  >
                    {comment.postedBy.name}
                  </Link>
                </span>{" "}
                <span>{comment.comment}</span>{" "}
                {comment.postedBy._id === state?._id && (
                  <IconButton
                    size="medium"
                    edge="end"
                    style={{ color: "red" }}
                    onClick={() => DeleteComment(d._id, comment._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                )}
              </p>
            ))}

            <TextField
              type="text"
              placeholder="add a comment"
              label="Comment"
              variant="filled"
              className="homeContainer__card--Content-input"
              error={error.comment ? true : false}
              helperText={error.comment ? error.comment : ""}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  if (state) {
                    commentOnPost(d._id, e.target.value);
                    e.target.value = "";
                  } else {
                    Swal.fire(
                      "Must Logging first",
                      "You must be logged in first to comment on any post",
                      "warning"
                    );
                  }
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowedUserPost;

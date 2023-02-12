import { IconButton, TextField } from "@mui/material";
import ParkOutlinedIcon from "@mui/icons-material/ParkOutlined";
import AcUnitOutlinedIcon from "@mui/icons-material/AcUnitOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import ParkIcon from "@mui/icons-material/Park";
import React, { useEffect, useState, useContext } from "react";
import "./Home.css";
import axios from "axios";
import { UserContext } from "../../App";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import EditPost from "../EditPost/EditPost";
import { metaTitle } from "../../utils/MetaTitle";

const Home = () => {
  metaTitle("Plant Story - Home");
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [edit, setEdit] = useState(false);
  const [error, setError] = useState({
    comment: "",
  });
  const [EditPostDialogOpen, setEditPostDialogOpen] = useState(false);
  const [editPostId, setEditPostId] = useState("");

  useEffect(() => {
    const getAllPostData = async () => {
      const res = await axios.get(
        "https://plantstory-backend.onrender.com/allPost"
      );
      setData(res.data.posts);
    };
    getAllPostData();
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
    setData(res.data.posts);
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
    setData(res.data.posts);
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
    const newData = data.filter((item) => {
      return item._id !== res.data.result._id;
    });

    setData(newData);
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

    setData(res.data.posts);
  };

  return (
    <div className="homeContainer">
      {data.map((d) => (
        <div className="homeContainer__card" key={d._id}>
          <h1 className="ProfileName">
            <img
              src={d.postedBy.profilePic}
              alt="profileImage"
              className="ProfileImage"
            />
            <Link
              to={
                d.postedBy._id !== state?._id
                  ? `/profile/${d.postedBy._id}`
                  : "/profile"
              }
              className="PostName"
            >
              {" "}
              {d.postedBy.name}
            </Link>{" "}
            {d.postedBy._id === state?._id && (
              <>
                <IconButton
                  size="large"
                  edge="end"
                  style={{ float: "right", color: "green" }}
                  onClick={() => {
                    setEditPostId(d._id);
                    setEditPostDialogOpen(!EditPostDialogOpen);
                  }}
                >
                  <BorderColorIcon />
                </IconButton>
                <IconButton
                  size="large"
                  edge="end"
                  style={{ float: "right", color: "red" }}
                  onClick={() => DeletePost(d._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </>
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
              <p className="CommentSection">
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

      <EditPost
        EditPostDialogOpen={EditPostDialogOpen}
        setEditPostDialogOpen={setEditPostDialogOpen}
        editPostId={editPostId}
      />
    </div>
  );
};

export default Home;

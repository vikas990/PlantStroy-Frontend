import {
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
  useMediaQuery,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./EditPost.css";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import Swal from "sweetalert2";

const EditPost = ({
  EditPostDialogOpen,
  setEditPostDialogOpen,
  editPostId,
}) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState({
    title: "",
    body: "",
    image: "",
  });

  const SubmitPostDetails = async (e) => {
    e.preventDefault();
    if (title.length <= 0) {
      return setError(
        {
          title: "Title field is required",
        },
        { ...error }
      );
    }
    if (body.length <= 0) {
      return setError(
        {
          body: "Body field is required",
        },
        { ...error }
      );
    }
    if (image.length <= 0) {
      return setError(
        {
          image: "Please select a image for the post",
        },
        { ...error }
      );
    }
    try {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "PlantStory");
      data.append("cloud_name", "vikaskumar1234567");
      const ImageUploadResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/vikaskumar1234567/image/upload",
        data
      );
      setUrl(ImageUploadResponse.data.url);
    } catch (err) {
      return console.log(err);
    }

    if (url) {
      try {
        const postData = { title, body, pic: url, id: editPostId };
        const res = await axios.put(
          "https://plantstory-backend.onrender.com/updatePost",
          postData,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
          }
        );
        setEditPostDialogOpen(false);
        Swal.fire(
          "Uploaded 😄",
          "Thanks for Sharing a Plant Story 😉",
          "success"
        );
        console.log(res);
      } catch (err) {
        setEditPostDialogOpen(false);
        Swal.fire(
          "Error",
          err.response.data.error ||
            "Something went wrong! Please try again later 🔺",
          "error"
        );
      }
    }
  };

  const fullScreen = useMediaQuery("(max-width:48rem)");

  const handleClose = () => {
    setEditPostDialogOpen(false);
  };
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={EditPostDialogOpen}
        onClose={handleClose}
        fullWidth={true}
        fullHeight={true}
      >
        <CloseIcon onClick={() => handleClose()} className="closeIcon" />
        <DialogTitle>
          <h1 className="heading">Edit Post</h1>
        </DialogTitle>
        <form onSubmit={SubmitPostDetails}>
          <div className="CreatePost">
            <TextField
              type="text"
              placeholder="Title"
              label="Title"
              variant="filled"
              className="CreatePost__input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={error.title ? true : false}
              helperText={error.title ? error.title : ""}
            />
            <br />
            <br />
            <br />
            <TextField
              type="text"
              placeholder="Body"
              label="Body"
              variant="filled"
              className="CreatePost__input"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              error={error.body ? true : false}
              helperText={error.body ? error.body : ""}
            />
            <br />
            <br />
            <br />
            <TextField
              type="file"
              placeholder="Image"
              variant="filled"
              className="CreatePost__input"
              onChange={(e) => setImage(e.target.files[0])}
              error={error.image ? true : false}
              helperText={error.image ? error.image : ""}
            />
            <br />
            <button className="CreatePost__button">Submit Post</button>
          </div>
        </form>
      </Dialog>
    </>
  );
};

export default EditPost;

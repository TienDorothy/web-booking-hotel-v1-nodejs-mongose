import "./newUser.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { authApi, cloudApi } from "../../api/apiConfig";
import axiosConfig from "../../api/axiosConfig";
import axios from "axios";

const NewUser = ({ inputs, title }) => {
  const navigate = useNavigate();
  const [postLoading, setPostLoading] = useState(false);

  const [file, setFile] = useState("");
  const [info, setInfo] = useState("");
  const handleInput = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload");

    setPostLoading(true);
    try {
      const uploadRes = await axios.post(cloudApi, data);
      if (!uploadRes.status === 200) {
        return alert("Upload Image something wrong");
      }

      const { url } = uploadRes.data;

      const newUser = { ...info, img: url };
      const response = await axiosConfig.post(authApi.newUser, newUser);
      if (response.status === 200) {
        alert("Add a New User!");
        navigate("/");
      }
    } catch (err) {
      alert(err.response.data.message);
    }
    setPostLoading(false);
  };
  useEffect(()=>{
    
  },[file]);
  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                file
                  ? URL.createObjectURL(file)
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>

              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    onChange={handleInput}
                    type={input.type}
                    placeholder={input.placeholder}
                    id={input.id}
                  />
                </div>
              ))}
              <button onClick={handleSubmit}>
                {postLoading ? "Loading..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;

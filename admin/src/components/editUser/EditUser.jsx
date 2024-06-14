import "./editUser.scss";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { cloudApi, userApi } from "../../api/apiConfig";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import axiosConfig from "../../api/axiosConfig";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function EditHotel({ inputs, title, defaultValues }) {
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...defaultValues },
  });

  const onSubmit = async (data) => {
    setPostLoading(true);
    try {
      // set value imgUrl
      let imgUrl = defaultValues.img;
      // update image Url
      if (file) {
        const imgUpload = new FormData();
        imgUpload.append("file", file);
        imgUpload.append("upload_preset", "upload");

        const uploadRes = await axios.post(cloudApi, imgUpload);
        imgUrl = uploadRes.data.url;

        if (uploadRes.status !== 200) {
          return alert("Upload image something wrong");
        }
      }
      const { img, ...other } = data;
      const userUpdate = { ...other, img: imgUrl };
      console.log("userUpdate", userUpdate);

      const response = await axiosConfig.put(
        userApi.updateById(data._id),
        userUpdate
      );
      if (response.status === 200) {
        alert("Update success!");
        navigate("/users");
      }
      setPostLoading(false);
    } catch (error) {
      console.log("error :>> ", error);
      alert("Update something wrong");
    }
  };

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
                  : defaultValues.img
                  ? defaultValues.img
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="formInput">
                <label htmlFor="img">
                  Image: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="img"
                  {...register("img")}
                  onChange={(e) => setFile(e.target.files[0])}
                  style={{ display: "none" }}
                />
              </div>
              {inputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    type={input.type}
                    {...register(input.id, {
                      required: true,
                    })}
                    placeholder={input.placeholder}
                  />
                  {errors[input?.id] && (
                    <p className="error">{`This ${input.id} is required`}</p>
                  )}
                </div>
              ))}
              <div className="formAction">
                <input
                  type="submit"
                  className="submit"
                  value={postLoading ? "Loading..." : "Submit"}
                  disabled={postLoading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

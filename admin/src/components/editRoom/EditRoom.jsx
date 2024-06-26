import "./editRoom.scss";
import Sidebar from "../sidebar/Sidebar";
import Navbar from "../navbar/Navbar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { roomApi } from "../../api/apiConfig";
import { useNavigate } from "react-router-dom";
import axiosConfig from "../../api/axiosConfig";

export default function EditRoom({ inputs, title, defaultValues }) {
  const navigate = useNavigate();
  const [postLoading, setPostLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { ...defaultValues },
  });

  const onSubmit = async (data) => {
    const { roomNumbers, ...other } = data;
    let transformRoom = roomNumbers;
    if (!Array.isArray(roomNumbers)) {
      transformRoom = roomNumbers.split(",");
    }

    const roomUpdate = { ...other, roomNumbers: transformRoom };
    console.log(roomUpdate);
    setPostLoading(true);
    try {
      await axiosConfig.put(roomApi.updateById(defaultValues._id), roomUpdate);
    } catch (error) {
      console.log("error :>> ", error);
    }
    setPostLoading(false);
    alert("The room has updated");
    navigate("/rooms");
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
          <form onSubmit={handleSubmit(onSubmit)}>
            {inputs &&
              inputs.map((input) => (
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
            <div className="formBottom">
              <div className="formInput">
                <label htmlFor="rooms">Rooms
                  <span>(give comma between room numbers)</span>
                </label>
                <textarea
                  id="rooms"
                  cols="30"
                  rows="3"
                  {...register("roomNumbers", { required: true })}
                  placeholder="give comma between room numbers"
                />
                {errors.rooms && (
                  <p className="error">{`This rooms is required`}</p>
                )}
              </div>

              <div className="formAction">
                <input
                  type="submit"
                  className="submit submit-hotel"
                  value={postLoading ? "Loading..." : "Send"}
                  disabled={postLoading}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

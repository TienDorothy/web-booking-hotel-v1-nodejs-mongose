import React, { useContext, useEffect } from "react";
import "./reserve.scss";
import { useState } from "react";
import { DateRange } from "react-date-range";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import useFetch from "../../hooks/useFetch";
import { hotelsApi } from "../../api/apiConfig";
import { SearchContext } from "../../context/SearchContext";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Loading from "../loading/Loading";
import axiosConfig from "../../api/axiosConfig";

// validate Form
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const schema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Email format is not valid")
    .required("Email is required"),
  phone: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .length(10)
    .required("Phone is required"),
  card: yup.string(),
  payment: yup.string().required("Payment is required"),
});
// validate Form --end

function Reserve({ hotelId, priceDefault }) {
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(hotelsApi.getRooms(hotelId));
  console.log('data', data)
  const { dates } = useContext(SearchContext);
  const { user } = useContext(AuthContext);
  let defaultValues = {
    name: user.fullName,
    email: user.email,
    phone: user.phone,
  };
  const form = useForm({ defaultValues, resolver: yupResolver(schema) });
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  let startDate =
    new Date() > new Date(dates[0].startDate)
      ? new Date()
      : new Date(dates[0].startDate);
  const [date, setDate] = useState([
    {
      startDate: startDate,
      endDate: new Date(dates[0].endDate),
      key: "selection",
    },
  ]);

  const [postLoading, setPostLoading] = useState(false);
  const [totalBill, setTotalBill] = useState(0);
  const [roomErr, setRoomErr] = useState(null);
  let diffDay = Math.round(
    (new Date(date[0].endDate) - new Date(date[0].startDate)) /
      (1000 * 60 * 60 * 24) +
      1
  );
  const rooms = watch("rooms");
  let sum = 0;
  let roomArray = [];
  for (const key in rooms) {
    if (rooms[key].roomNumbers?.length > 0) {
      roomArray.push({
        roomId: key,
        roomNumbers: rooms[key].roomNumbers,
      });
      let quantity = rooms[key].roomNumbers.length;
      let price = rooms[key].price;
      sum += price * quantity;
    }
  }
  useEffect(() => {
    let bill = sum * diffDay;
    setTotalBill(bill);
  }, [sum, diffDay]);
  // // ------------------ ///
  const onSubmit = async (input) => {
    console.log("input", input);
    console.log("(input.rooms.length)");
    if (!roomArray.length) return setRoomErr("Room is required");
    else setRoomErr(null);

    let transaction = {
      userId: user._id,
      hotelId: hotelId,
      rooms: roomArray,
      dateStart: date[0].startDate,
      dateEnd: date[0].endDate,
      price: totalBill,
      payment: input.payment,
      status: "Booked",
    };
    console.log("transaction :>> ", transaction);
    setPostLoading(true);
    try {
      await axiosConfig.post("/transactions", transaction);
      navigate(`/transaction/${user._id}`);
    } catch (error) {
      console.log("error :>> ", error);
    }
    setPostLoading(false);
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="reserve">
            <div className="formDate">
              <h2>Dates</h2>
              <DateRange
                editableDateInputs={true}
                onChange={(item) => setDate([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={date}
                minDate={new Date()}
              />
            </div>

            <div className="formInfo">
              <h2>Reserve Info</h2>
              <div className="formControl">
                <label>
                  Your Full Name <span>*(required)</span>
                </label>
                <input {...register("name")} placeholder="Full Name" />
                <p>{errors.name?.message}</p>
              </div>
              <div className="formControl">
                <label>
                  Your Email <span>*(required)</span>
                </label>
                <input {...register("email")} placeholder="Email" />
                <p>{errors.email?.message}</p>
              </div>
              <div className="formControl">
                <label>
                  Your Phone Number <span>*(required)</span>
                </label>
                <input {...register("phone")} placeholder="Phone Number" />
                <p>{errors.phone?.message}</p>
              </div>
              <div className="formControl">
                <label>
                  Your Identity Card Number 
                </label>
                <input {...register("card")} placeholder="Your card number" />
                <p>{errors.card?.message}</p>
              </div>
            </div>
            {/*  */}
            <div className="selectRooms">
              <h2>Select Room</h2>
              <p className="error">{roomErr}</p>

              <div className="rooms">
                {data &&
                  data.map((room, i) => {
                    return (
                      <div className="room" key={i}>
                        <div className="roomDesc">
                          <p className="title">{room?.title}</p>
                          <p>{room?.desc}</p>
                          <p className="people">
                            Max people: <strong>{room?.maxPeople}</strong>
                          </p>
                          <p className="price">${room?.price}</p>
                        </div>
                        <div className="roomNumbers">
                          {room &&
                            room.roomNumbers.map((roomNumber, i) => (
                              <div className="formCheckbox" key={i}>
                                <label>{roomNumber}</label>
                                <input
                                  type="checkbox"
                                  value={roomNumber}
                                  {...register(
                                    `rooms.${room._id}.roomNumbers`,
                                    {
                                      required: true,
                                    }
                                  )}
                                />
                                <input
                                  type="text"
                                  hidden={true}
                                  value={room.price}
                                  {...register(`rooms.${room._id}.price`)}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bill ">
              <h2 className="bill-title">
                Total Bill: ${totalBill || priceDefault}
              </h2>

              <select
                className="select"
                id="payment"
                defaultValue=""
                {...register("payment", { required: true })}
              >
                <option disabled value="">
                  Select Payment Method
                </option>
                <option value="Credit Cart">Credit Cart</option>
                <option value="Cash">Cash</option>
              </select>
              <p className="error">{errors.payment?.message}</p>
            </div>
            <div className="formAction">
              <input
                type="submit"
                disabled={postLoading}
                value={postLoading ? "Sending..." : "Reserve Now"}
              />
            </div>
          </div>
        </form>
      )}
    </>
  );
}

export default Reserve;

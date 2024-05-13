import TextField from "@/src/components/TextField";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Image from "next/image";
import loginback from "../../assets/images/admin-login-image.png";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTime } from "@/src/redux/action/bookinb";
import { logout } from "@/src/redux/action/user";
import Cookies from "js-cookie";

const index = () => {
  const distpatch = useDispatch();
  const { selectedTime, testproperty } = useSelector((state) => state.booking);
  const [inputValue, setInputValue] = useState({ email: "", password: "" });
  const { email, password } = inputValue;

  useEffect(() => {
    console.log(selectedTime, "selectedTime");
    distpatch(setSelectedTime("powsi"));
  }, []);

  const handleEmailChange = (value) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      email: value,
    }));
  };

  const handlePasswordChange = (value) => {
    setInputValue((prevInputValue) => ({
      ...prevInputValue,
      password: value,
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await fetch("http://localhost:5000/api/users/auth", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ username: email, password })
  //     });
  //     if (response.status==200) {
  //       const data = await response.json();
  //       toast.success("Login successful")
  //       console.log("Login successful");
  //       console.log(data);
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Login failed:", errorData.message);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const session = Cookies.get("token", { path: "/" });
    console.log(session,"session");
    logout()
    // try {
    //   const response = await axios.post(
    //     "http://localhost:5000/api/users/auth",
    //     {
    //       username: email,
    //       password: password,
    //     }
    //   );
    //   if (response.status == 200) {
    //     toast.success(response.data.message);
    //     console.log("Login successful");
    //     console.log(response.data);
    //   } else {
    //     toast.error(error.response.data.message);
    //   }
    // } catch (error) {
    //   // Handle error
    //   toast.error(error.response.data.message);
    //   console.error("Login failed:", error.response.data.message);
    // }
  };

  return (
    <div
      className="d-flex flex-column min-vh-100"
      style={{ backgroundColor: "green" }}
    >
      {/* <Navbar/> */}
      <div>
        <Image src={loginback} alt="" />
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <TextField
            type="text"
            value={email}
            placeholder="Email"
            label="Email"
            onChange={handleEmailChange}
            width={200}
            // disable={true}
          />
          <TextField
            type={"password"}
            value={password}
            placeholder="Password"
            label="Password"
            onChange={handlePasswordChange}
            width={200}
          />
          <button className="btn btn-primary " type="submit">
            Login
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default index;
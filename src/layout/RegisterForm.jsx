import axios from "axios";
import React from "react";
import { useState } from "react";
import Swal from "sweetalert2"; // Import Swal from sweetalert2 library

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // Validation
      if (input.password !== input.confirmPassword) {
        return alert("Please check confirm password");
      }
      const rs = await axios.post("http://localhost:8889/auth/register", input);
      console.log(rs);
      if (rs.status === 200) {
        // Display success message using SweetAlert
        Swal.fire({
          title: "Good job!",
          text: "Register Successful",
          icon: "success",
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <div className="flex flex-col justify-center min-h-screen ">
      <h1 className=" text-3xl font-bold text-center ">ลงทะเบียน</h1>
      <div className="flex justify-center mt-10">
        <div>
          <form onSubmit={hdlSubmit}>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">username</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">password</span>
              </div>
              <input
                type="text"
                className="input input-bordered w-full max-w-xs"
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Confirm Password</span>
              </div>
              <input
                type="password"
                className="input input-bordered w-full max-w-xs"
                name="confirmPassword"
                value={input.confirmPassword}
                onChange={hdlChange}
              />
            </label>
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="email"
                className="input input-bordered w-full max-w-xs"
                name="email"
                value={input.email}
                onChange={hdlChange}
              />
            </label>

            <div className="flex justify-center items-end py-3 mt-5">
              <button type="submit" className="btn w-full max-w-xs">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

import axios from "axios";
import React, { useState } from "react";
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
      const rs = await axios.post("https://back-1-1ov9.onrender.com/auth/register", input);
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
    <div className="flex justify-center items-center h-screen -mt-20">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
        <h1 className="text-3xl font-bold text-center">ลงทะเบียน</h1>
        <form onSubmit={hdlSubmit} className="space-y-5 p-5">
          <div className="form-control">
            <label htmlFor="username" className="label">
              <span className="label-text">ชื่อผู้ใช้</span>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={input.username}
              onChange={hdlChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password" className="label">
              <span className="label-text">รหัสผ่าน</span>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={input.password}
              onChange={hdlChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label htmlFor="confirmPassword" className="label">
              <span className="label-text">ยืนยัน รหัสผ่าน</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={input.confirmPassword}
              onChange={hdlChange}
              className="input input-bordered"
            />
          </div>
          <div className="form-control">
            <label htmlFor="email" className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={hdlChange}
              className="input input-bordered"
            />
          </div>
          <div className="flex justify-center">
            <button type="submit" className="btn btn-success w-full">
              ยืนยัน
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

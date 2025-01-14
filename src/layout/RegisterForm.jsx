import axios from "axios";
import React, { useState } from "react";
import Swal from "sweetalert2"; // ใช้ SweetAlert สำหรับแสดงข้อความแจ้งเตือน
import { useNavigate } from "react-router-dom"; // ใช้ useNavigate สำหรับการเปลี่ยนเส้นทาง

export default function RegisterForm() {
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "",
  });

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงข้อมูลใน form
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ฟังก์ชันสำหรับการส่งข้อมูลหลังจากการกรอกฟอร์ม
  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      // ตรวจสอบความตรงกันระหว่างรหัสผ่านและยืนยันรหัสผ่าน
      if (input.password !== input.confirmPassword) {
        return alert("Please check confirm password");
      }
      // ส่งข้อมูลลงทะเบียนไปยัง API
      const rs = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, input);
      console.log(rs);
      if (rs.status === 200) {
        // แสดงข้อความสำเร็จเมื่อสมัครเสร็จ
        Swal.fire({
          title: "Good job!",
          text: "Register Successful",
          icon: "success",
        });
        // เปลี่ยนเส้นทางไปยังหน้าล็อกอิน
        navigate("/login");
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

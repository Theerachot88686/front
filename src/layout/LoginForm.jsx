import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";

export default function LoginForm() {
  const { setUser, run } = useAuth();
  const navigate = useNavigate();
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      const rs = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        input
      );
      console.log(rs.data);

      localStorage.setItem("userData", JSON.stringify(rs.data));
      setUser(rs.data.data);

      Swal.fire({
        title: "Good job!",
        text: "ยินดีต้อนรับ",
        icon: "success",
      });

      setTimeout(() => {
        if (rs.data.role === "admin") {
          run();
          navigate("/admin/manage");
        } else {
          run();
          navigate("/");
        }
      }, 2000);
    } catch (err) {
      Swal.fire({
        title: "Error!",
        text: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        icon: "error",
      });
    }
  };

  return (
    <div className="hero min-h-screen -mt-10">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Keerati Arena Sports Club</h1>
          <p className="py-6">
            Manchester United are in Premier League action again this weekend,
            facing Luton Town on our first top-flight visit to Kenilworth Road
            since April 1992. Erik ten Hag’s men are unbeaten in 2024,
            overcoming a stern test in the shape of Aston Villa last time out
            thanks to goals from Rasmus Hojlund and Scott McTominay.
          </p>
        </div>
        <div className="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <form className="card-body" onSubmit={hdlSubmit}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">ชื่อผู้ใช้</span>
              </label>
              <input
                type="text"
                placeholder="username"
                className="input input-bordered"
                required
                name="username"
                value={input.username}
                onChange={hdlChange}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                required
                name="password"
                value={input.password}
                onChange={hdlChange}
              />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-success w-full">
                เข้าสู่ระบบ
              </button>
            </div>
            <div className="form-control mt-2 text-center">
              <button
                onClick={() => navigate("/request-reset-password")}
                className="text-blue-500"
              >
                ลืมรหัสผ่าน?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

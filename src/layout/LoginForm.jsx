import axios from "axios"; // นำเข้า Axios สำหรับการทำ API requests
import { useState } from "react"; // นำเข้า useState สำหรับการจัดการสถานะใน React
import { useNavigate } from "react-router-dom"; // นำเข้า useNavigate สำหรับการนำทางใน React Router
import useAuth from "../hooks/useAuth"; // นำเข้า custom hook useAuth สำหรับการจัดการข้อมูลผู้ใช้
import Swal from "sweetalert2"; // นำเข้า SweetAlert2 สำหรับการแสดงข้อความแจ้งเตือน

export default function LoginForm() {
  const { setUser , run } = useAuth(); // ใช้ useAuth hook เพื่อตั้งค่าผู้ใช้และเรียกใช้งานการตั้งค่าผู้ใช้
  const navigate = useNavigate(); // ใช้ useNavigate เพื่อทำการนำทางไปยังหน้าอื่น ๆ
  const [input, setInput] = useState({
    username: "",
    password: "",
  }); // สถานะสำหรับเก็บข้อมูลจากฟอร์มการเข้าสู่ระบบ

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงค่าของ input ในฟอร์ม
  const hdlChange = (e) => {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ฟังก์ชันสำหรับการส่งข้อมูลฟอร์มเข้าสู่ระบบ
  const hdlSubmit = async (e) => {
    try {
      e.preventDefault(); // ป้องกันการรีเฟรชหน้าจอเมื่อส่งฟอร์ม
      // ส่งข้อมูลเข้าสู่ระบบไปยัง API
      const rs = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, input);
      console.log(rs.data); // แสดงข้อมูลที่ได้รับจาก API

      // เก็บข้อมูลผู้ใช้ใน localStorage
      localStorage.setItem("userData", JSON.stringify(rs.data));
      setUser(rs.data.data); // ตั้งค่าผู้ใช้ใน context ของแอป

      // แสดงข้อความแจ้งเตือนเมื่อเข้าสู่ระบบสำเร็จ
      Swal.fire({
        title: "Good job!",
        text: "ยินดีต้อนรับ",
        icon: "success"
      });

      // เลื่อนการนำทางไปหน้าถัดไปภายใน 2 วินาที
      setTimeout(() => {
        // หากผู้ใช้มีบทบาทเป็น admin ให้นำทางไปยังหน้าจัดการ
        if(rs.data.role === "admin"){
          run(); // เรียกใช้งานฟังก์ชัน run จาก useAuth
          navigate("/admin/manage");
        } else {
          run();
          navigate("/"); // นำทางไปยังหน้าโฮม
        }
      }, 2000);

    } catch (err) {
      // แสดงข้อความแจ้งเตือนหากเข้าสู่ระบบล้มเหลว
      Swal.fire({
        title: "Error!",
        text: "Incorrect username or password",
        icon: "error",
      });
    }
  };

  return (
    <div className="hero min-h-screen -mt-10">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">Football Club</h1>
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
          </form>
        </div>
      </div>
    </div>
  );
}

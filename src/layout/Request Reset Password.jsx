import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/request-reset-password`,
        { email }
      );
      Swal.fire(
        "Success!",
        "กรุณาตรวจสอบอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน",
        "success"
      );
    } catch (error) {
      Swal.fire("Error!", "ไม่พบบัญชีผู้ใช้นี้", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen justify-center">
      <h2 className="text-2xl font-bold mb-4">ขอรีเซ็ตรหัสผ่าน</h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white p-6 shadow-md rounded"
      >
        <label className="block mb-2">อีเมล</label>
        <input
          type="email"
          className="w-full p-2 border rounded mb-4"
          placeholder="example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? "กำลังส่ง..." : "ส่งคำขอ"}
        </button>
      </form>
    </div>
  );
};

export default RequestResetPassword;

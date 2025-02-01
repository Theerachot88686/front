import React from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from "chart.js";

// เริ่มต้น Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

export default function Manage() {
  const navigate = useNavigate();

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Users
  const goToUsers = () => {
    navigate("/admin/manageuser");
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Booking Fields
  const goToSettings = () => {
    navigate("/admin/manage/bookingfield");
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Fields
  const goToReports = () => {
    navigate("/admin/manage/field");
  };

  // ข้อมูลสำหรับกราฟวงกลมจำนวนผู้ใช้งาน
  const userData = {
    labels: ["ผู้ใช้งาน", "อื่นๆ"],
    datasets: [
      {
        label: "จำนวนผู้ใช้งาน",
        data: [120, 180], // จำนวนผู้ใช้งาน (120) และอื่นๆ (180)
        backgroundColor: ["rgba(75, 192, 192, 0.2)", "rgba(255, 159, 64, 0.2)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 159, 64, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // ข้อมูลสำหรับกราฟวงกลมจำนวนการจอง
  const bookingData = {
    labels: ["การจอง", "ยังไม่จอง"],
    datasets: [
      {
        label: "จำนวนการจอง",
        data: [45, 75], // จำนวนการจอง (45) และยังไม่จอง (75)
        backgroundColor: [
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 99, 132, 0.2)",
        ],
        borderColor: ["rgba(153, 102, 255, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your application settings and users
          </p>
        </div>

        {/* Manage Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: จัดการผู้ใช้ */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10"></figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">จัดการผู้ใช้</h2>
              <p>ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ</p>
              <div className="card-actions">
                <button className="btn btn-primary" onClick={goToUsers}>
                  Go to Users
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: จัดการการจอง */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10"></figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">การจอง</h2>
              <p>ดูและจัดการ การจองสนามฟุตบอล</p>
              <div className="card-actions">
                <button className="btn btn-secondary" onClick={goToSettings}>
                  Go to Booking
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: จัดการสนามฟุตบอล */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10"></figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">จัดการสนามฟุตบอล</h2>
              <p>ดูและจัดการสนามฟุตบอล</p>
              <div className="card-actions">
                <button className="btn btn-accent" onClick={goToReports}>
                  Go to Field
                </button>
              </div>
            </div>
          </div>
          {/* กราฟวงกลมจำนวนผู้ใช้งาน */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              กราฟจำนวนผู้ใช้งาน
            </h2>
            <div className="mt-6">
              <Pie data={userData} />
            </div>
          </div>
          {/* กราฟวงกลมจำนวนการจอง */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              กราฟจำนวนการจอง
            </h2>
            <div className="mt-6">
              <Pie data={bookingData} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">บอลไทยไปมวยโลก</p>
        </div>
      </div>
    </div>
  );
}

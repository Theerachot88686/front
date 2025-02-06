import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement, // Add this import
  LineElement, // Add this import if you're using Line charts
} from "chart.js";

// Registering the PointElement and LineElement
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  BarElement,
  LinearScale,
  PointElement, // Register PointElement
  LineElement // Register LineElement for line charts
);

export default function Manage() {
  const navigate = useNavigate();
  const [roleCounts, setRoleCounts] = useState({});
  const [bookingCounts, setBookingCounts] = useState({});
  const [topBookingTimesData, setTopBookingTimesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [visitorCount, setVisitorCount] = useState(0);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking`
        );

        // กำหนดวันที่เริ่มต้นและสิ้นสุดของ 3 ช่วงเวลา (ใช้ dueDate แทน)
        const today = new Date();
        const currentYear = today.getFullYear();

        // คำนวณวันที่เริ่มต้นและสิ้นสุดของ 3 ช่วงเวลา (2 เดือนก่อน, เดือนก่อนหน้า, เดือนปัจจุบัน)
        const startCurrentMonth = new Date(currentYear, today.getMonth(), 1);
        const endCurrentMonth = new Date(currentYear, today.getMonth() + 1, 0);

        const startLastMonth = new Date(currentYear, today.getMonth() - 1, 1);
        const endLastMonth = new Date(currentYear, today.getMonth(), 0);

        const startTwoMonthsAgo = new Date(currentYear,today.getMonth() - 2,1);
        const endTwoMonthsAgo = new Date(currentYear, today.getMonth() - 1, 0);

        // ฟังก์ชั่นเช็คว่า dueDate ตรงกับช่วงเวลา 3 เดือนหรือไม่
        const isBookingInDueDateRange = (dueDate, startDate, endDate) => {
          const bookingDueDate = new Date(dueDate);
          return bookingDueDate >= startDate && bookingDueDate <= endDate;
        };

        // ตัวแปรสำหรับเก็บจำนวนการจองในแต่ละช่วงเวลา
        const bookingCounts = {
          currentMonth: 0,
          lastMonth: 0,
          twoMonthsAgo: 0,
        };

        // นับจำนวนการจองในแต่ละช่วงเวลา
        response.data.forEach((booking) => {
          const dueDate = booking.dueDate;
          if (
            isBookingInDueDateRange(dueDate, startCurrentMonth, endCurrentMonth)
          ) {
            bookingCounts.currentMonth += 1;
          } else if (
            isBookingInDueDateRange(dueDate, startLastMonth, endLastMonth)
          ) {
            bookingCounts.lastMonth += 1;
          } else if (
            isBookingInDueDateRange(dueDate, startTwoMonthsAgo, endTwoMonthsAgo)
          ) {
            bookingCounts.twoMonthsAgo += 1;
          }
        });

        // แสดงข้อมูลการจองในแต่ละช่วงเวลา
        console.log("การจองในเดือนปัจจุบัน:", bookingCounts.currentMonth);
        console.log("การจองในเดือนที่แล้ว:", bookingCounts.lastMonth);
        console.log("การจองในเดือนที่แล้ว 2 เดือน:",bookingCounts.twoMonthsAgo);

        // ตั้งค่าข้อมูลที่ได้เพื่อใช้ในกราฟหรือ UI
        setBookingCounts(bookingCounts);
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
    
    const fetchBookingTimes = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/booking`
        );

        // สร้าง Object เพื่อเก็บจำนวนการจองตามช่วงเวลา
        const timeSlotCounts = {};

        response.data.forEach((booking) => {
          const startTime = new Date(booking.startTime); // แปลง startTime เป็น Date object
          const endTime = new Date(booking.endTime); // แปลง endTime เป็น Date object

          // คำนวณช่วงเวลาของการจอง (สามารถปรับช่วงเวลาได้ตามที่ต้องการ)
          const timeSlot = `${startTime.getHours()}:${startTime.getMinutes()} - ${endTime.getHours()}:${endTime.getMinutes()}`;

          // เพิ่มจำนวนการจองในช่วงเวลานั้น
          timeSlotCounts[timeSlot] = (timeSlotCounts[timeSlot] || 0) + 1;
        });

        // เรียงข้อมูลตามจำนวนการจองจากมากไปหาน้อย และเลือก 5 อันดับแรก
        const top5TimeSlots = Object.entries(timeSlotCounts)
          .sort((a, b) => b[1] - a[1]) // เรียงข้อมูลตามจำนวนการจอง (จากมากไปหาน้อย)
          .slice(0, 5); // เลือก 5 อันดับแรก

        const labels = top5TimeSlots.map((item) => item[0]); // นำช่วงเวลามาเป็น label
        const data = top5TimeSlots.map((item) => item[1]); // นำจำนวนการจองมาเป็นข้อมูล
        setTopBookingTimesData({
          labels,
          datasets: [
            {
              label: "จำนวนการจองตามช่วงเวลา",
              data,
              fill: false,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching booking times:", error);
      }
    };

    const fetchData = async () => {
      setIsLoading(true);
      await Promise.all([fetchBookingData(), fetchBookingTimes()]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/auth/users`
        );
        const bookings = response.data;
        const counts = {};

        // นับจำนวนผู้ใช้งานตาม role
        bookings.forEach((booking) => {
          const role = booking.user?.role || "ไม่ระบุ"; // ตรวจสอบว่า user มี role หรือไม่
          counts[role] = (counts[role] || 0) + 1;
        });

        setRoleCounts(counts);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล:", error);
      }
    };

    fetchData();
  }, []);

  // คำนวณจำนวนผู้ใช้งานทั้งหมด
  const totalUsers = Object.values(roleCounts).reduce(
    (acc, count) => acc + count,
    0
  );

  // ข้อมูลสำหรับกราฟวงกลมจำนวนการจอง
  const bookingData = {
    labels: ["เดือนปัจจุบัน", "เดือนที่แล้ว", "2 เดือนที่แล้ว"],
    datasets: [
      {
        label: "จำนวนการในแต่ละเดือน",
        data: [
          bookingCounts.currentMonth,
          bookingCounts.lastMonth,
          bookingCounts.twoMonthsAgo,
        ],
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // ข้อมูลสำหรับกราฟช่วงเวลาที่มีการจองมากที่สุด
  const bookingTimesChartData = {
    labels: topBookingTimesData.labels || [], // เลเบลของกราฟ (เช่น เวลา)
    datasets: [
      {
        label: "จำนวนการจองตามช่วงเวลา",
        data: topBookingTimesData.datasets?.[0]?.data || [], // จำนวนการจองในแต่ละช่วงเวลา
        backgroundColor: [
          "rgba(75, 192, 192, 0.2)", // สีของแท่งที่ 1
          "rgba(255, 159, 64, 0.2)", // สีของแท่งที่ 2
          "rgba(153, 102, 255, 0.2)", // สีของแท่งที่ 3
          "rgba(255, 99, 132, 0.2)", // สีของแท่งที่ 4
          "rgba(54, 162, 235, 0.2)", // สีของแท่งที่ 5
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)", // สีเส้นขอบของแท่งที่ 1
          "rgba(255, 159, 64, 1)", // สีเส้นขอบของแท่งที่ 2
          "rgba(153, 102, 255, 1)", // สีเส้นขอบของแท่งที่ 3
          "rgba(255, 99, 132, 1)", // สีเส้นขอบของแท่งที่ 4
          "rgba(54, 162, 235, 1)", // สีเส้นขอบของแท่งที่ 5
        ],
        borderWidth: 1, // ความหนาของเส้นขอบ
      },
    ],
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Users
  const goToUsers = () => {
    navigate("/admin/manageuser");
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Booking Fields
  const goTobook = () => {
    navigate("/admin/current-bookings");
  };

  const goTohistory = () => {
    navigate("/admin/history-bookings");
  };

  // ฟังก์ชันสำหรับนำทางไปยังหน้า Manage Fields
  const goToReports = () => {
    navigate("/admin/manage/field");
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
          <h2>จำนวนผู้ใช้งานทั้งหมด: {totalUsers}</h2>
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
                <button className="btn btn-secondary" onClick={goTobook}>
                  Go to Booking
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: จัดการการจอง */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10"></figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">ประวัติการจอง</h2>
              <p>ดูประวัติการจองสนามฟุตบอล</p>
              <div className="card-actions">
                <button className="btn btn-secondary" onClick={goTohistory}>
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
              ช่วงเวลาที่มีการจองมากที่สุด 5 อันดับ
            </h2>
            <div className="mt-6">
              <Bar data={bookingTimesChartData} />
            </div>
          </div>
          {/* กราฟวงกลมจำนวนการจอง */}
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-gray-900">
              กราฟจำนวนการจอง 3 เดือนล่าสุด
            </h2>
            <div className="mt-6">
              <Bar data={bookingData} />
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

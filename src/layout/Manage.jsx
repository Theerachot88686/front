import React from 'react';
import { useNavigate } from "react-router-dom";

export default function Manage() {
  const navigate = useNavigate(); 

  const goToUsers = () => {
    navigate("/admin/manageuser"); 
  };

  const goToSettings = () => {
    navigate("/admin/manage/bookingfield");
  };

  const goToReports = () => {
    navigate("/admin/manage/field"); 
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your application settings and users</p>
        </div>

        {/* Manage Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://placeimg.com/400/225/tech"
                alt="Manage Users"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">จัดการผู้ใช้</h2>
              <p>ดูและจัดการผู้ใช้ที่ลงทะเบียนทั้งหมดในระบบ</p>
              <div className="card-actions">
                <button className="btn btn-primary" onClick={goToUsers}>Go to Users</button>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://placeimg.com/400/225/business"
                alt="Manage Booking"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">การจอง</h2>
              <p>ดูและจัดการ การจองสนามฟุตบอล</p>
              <div className="card-actions">
                <button className="btn btn-secondary" onClick={goToSettings}>Go to Booking</button>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="card w-full bg-white shadow-xl">
            <figure className="px-10 pt-10">
              <img
                src="https://placeimg.com/400/225/tech"
                alt="Manage Field"
                className="rounded-xl"
              />
            </figure>
            <div className="card-body items-center text-center">
              <h2 className="card-title">จัดการสนามฟุตบอล</h2>
              <p>ดูและจัดการสถามฟุตบอล</p>
              <div className="card-actions">
                <button className="btn btn-accent" onClick={goToReports}>Go to Field</button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">© 2024 Your Application. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

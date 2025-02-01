import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageUser() {
  const [users, setUsers] = useState([]); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
  const [lastLogin, setLastLogin] = useState(null);
  const [editingUser, setEditingUser] = useState(null); // สถานะสำหรับเก็บข้อมูลผู้ใช้ที่กำลังแก้ไข
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  }); // สถานะสำหรับเก็บข้อมูลในฟอร์ม

  useEffect(() => {
    // ดึงข้อมูลจาก API เมื่อ component โหลดเสร็จ
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get/pull`,
          {}
        );
        setUsers(response.data); // เก็บข้อมูลที่ได้จาก API
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false); // เมื่อโหลดเสร็จแล้ว
      }
    };

    fetchUsers();
  }, []); // useEffect จะรันครั้งเดียวตอนที่ component โหลดเสร็จ

  // ฟังก์ชันสำหรับแก้ไขข้อมูลผู้ใช้
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: user.password || "",
      email: user.email || "",
      role: user.role || "",
    });
  };

  // ฟังก์ชันสำหรับเปลี่ยนแปลงค่าฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ส่งคำขอ PUT พร้อมข้อมูล
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/update/${editingUser.id}`,
        formData // ส่งข้อมูลที่ต้องการอัปเดต
      );

      // อัปเดตข้อมูลผู้ใช้ในสถานะหลังจากส่งข้อมูลสำเร็จ
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );

      setEditingUser(null); // ปิดฟอร์มการแก้ไข

      // แจ้งเตือนการบันทึกสำเร็จ
      Swal.fire("Updated!", "User details have been updated.", "success");
    } catch (error) {
      console.error("Error updating user:", error);

      // อ่านข้อความข้อผิดพลาดจากเซิร์ฟเวอร์ (ถ้ามี)
      const errorMessage =
        error.response?.data?.message ||
        "There was an error while updating the user.";

      // แจ้งเตือนกรณีเกิดข้อผิดพลาด
      Swal.fire("Error!", errorMessage, "error");
    }
  };

  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteClick = async (user) => {
    Swal.fire({
      title: `ต้องการลบ ${user.username}?`,
      text: ".",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_URL}/auth/delete/user/${user.id}`
          );

          // อัปเดตข้อมูลผู้ใช้ในสถานะหลังจากลบสำเร็จ
          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));

          // แจ้งเตือนการลบสำเร็จ
          Swal.fire(
            "Deleted!",
            `${user.username} has been deleted.`,
            "success"
          );
        } catch (error) {
          console.error("Error deleting user:", error);
          // แจ้งเตือนกรณีเกิดข้อผิดพลาด
          Swal.fire(
            "Error!",
            "There was an error while deleting the user.",
            "error"
          );
        }
      }
    });
  };

  const handleExport = async () => {
    if (!month || !year) {
      setError("Please select both month and year.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ส่งคำขอไปยัง API เพื่อดึงข้อมูลการจองตามเดือนและปี
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/export?month=${month}&year=${year}`,
        {
          responseType: "blob", // บอกให้ axios รับข้อมูลเป็นไฟล์
        }
      );

      // สร้าง URL สำหรับดาวน์โหลดไฟล์
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `bookings-${month}-${year}.csv`); // กำหนดชื่อไฟล์ที่ดาวน์โหลด
      document.body.appendChild(link);
      link.click(); // คลิกเพื่อดาวน์โหลดไฟล์

      setLoading(false);
    } catch (err) {
      setError("Error exporting data.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">
            จัดการ ผู้ใช้งาน
          </h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all registered users in your system
          </p>
        </div>

        {/* Search and Add User Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">ค้นหาผู้ใช้</span>
            </label>
            <input
              type="text"
              placeholder="ค้นหา"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="loader">Loading...</div>{" "}
            {/* สามารถเพิ่ม animation หรือ loader */}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Username</th>

                  <th>Email</th>
                  <th>Role</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.username}</td>

                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.lastLogin
                        ? new Date(user.lastLogin).toLocaleString()
                        : "Never"}
                    </td>
                    <td></td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditClick(user)}
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteClick(user)}
                      >
                        ลบ
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Form Modal */}
        {editingUser && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-1/3">
              <h2 className="text-xl font-semibold mb-4">Edit User</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="label">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary mr-2">
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)} // ปิดฟอร์มแก้ไข
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        
      </div>
    </div>
  );
}

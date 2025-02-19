// ManageUser.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageUser() {
  const [users, setUsers] = useState([]); // สถานะสำหรับเก็บข้อมูลผู้ใช้
  const [loading, setLoading] = useState(true); // สถานะสำหรับการโหลดข้อมูล
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
          `${import.meta.env.VITE_API_URL}/get/pull`
        );
        setUsers(response.data); // เก็บข้อมูลที่ได้จาก API
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

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

  // ฟังก์ชันสำหรับส่งข้อมูลไปยัง API (อัปเดตข้อมูลผู้ใช้)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/update/${editingUser.id}`,
        formData
      );
      // อัปเดตข้อมูลผู้ใช้ใน state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null);
      Swal.fire({
        title: "Updated!",
        text: "User details have been updated.",
        icon: "success",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#28a745", // สีเขียวสำหรับปุ่ม
        iconColor: "#28a745", // สีไอคอนเป็นสีเขียว
        background: "#d4edda", // พื้นหลังสีเขียวอ่อน
      });
    } catch (error) {
      console.error("Error updating user:", error);
      const errorMessage =
        error.response?.data?.message ||
        "There was an error while updating the user.";
      Swal.fire({
        title: "Error!",
        text: errorMessage,
        icon: "error",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#dc3545", // ปุ่มยืนยันสีแดง
        iconColor: "#dc3545", // สีไอคอนเป็นสีแดง
        background: "#f8d7da", // พื้นหลังสีแดงอ่อน
      });
    }
  };

  // ฟังก์ชันสำหรับลบผู้ใช้
  const handleDeleteClick = async (user) => {
    Swal.fire({
      title: `Are you sure you want to delete ${user.username}?`,
      text: "This action cannot be undone.",
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
          setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
          Swal.fire({
            title: "Deleted!",
            text: `${user.username} has been deleted.`,
            icon: "success",
            background: "#e8f5e9", // สีพื้นหลังเขียวอ่อน
            color: "#2e7d32", // สีตัวหนังสือเขียวเข้ม
            confirmButtonColor: "#388e3c", // สีปุ่มยืนยัน
          });
          
        } catch (error) {
          console.error("Error deleting user:", error);
          Swal.fire(
            "Error!",
            "There was an error while deleting the user.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">Manage Users</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all registered users in your system
          </p>
        </div>

        {/* Search and Add User Section */}
        <div className="flex justify-between items-center mb-6">
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Search Users</span>
            </label>
            <input
              type="text"
              placeholder="Search by username"
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="loader">Loading...</div>
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
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString("en-GB", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // ปิด AM/PM
                          })
                        : "Never"}
                    </td>

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
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingUser(null)}
                  >
                    Cancel
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

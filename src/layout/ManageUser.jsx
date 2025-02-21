import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const userRefs = useRef({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/get/pull`
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "",
      email: user.email || "",
      role: user.role || "",
    });
  };

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
          Swal.fire(
            "Deleted!",
            `${user.username} has been deleted.`,
            "success"
          );
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/update/${editingUser.id}`,
        formData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id ? { ...user, ...formData } : user
        )
      );
      setEditingUser(null);
      Swal.fire("Updated!", "User details have been updated.", "success");
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire(
        "Error!",
        "There was an error while updating the user.",
        "error"
      );
    }
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (searchTerm) {
      const firstMatch = filteredUsers[0];
      if (firstMatch) {
        setHighlightedUserId(firstMatch.id);
        userRefs.current[firstMatch.id]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      setHighlightedUserId(null);
    }
  }, [searchTerm, filteredUsers]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-semibold text-gray-900 text-center mb-8">
          Manage Users
        </h1>

        <div className="relative w-full max-w-xs mb-4">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center text-gray-500">
              🔍
            </span>
            <input
              type="text"
              placeholder="พิมพ์ชื่อผู้ใช้..."
              className="input input-bordered w-full pl-10 pr-3 rounded-lg shadow-md focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center mt-6">Loading...</div>
        ) : (
          <div className="flex justify-center">
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
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    ref={(el) => (userRefs.current[user.id] = el)}
                    className={
                      highlightedUserId === user.id ? "bg-yellow-200" : ""
                    }
                  >
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.lastLoginAt
                        ? new Date(user.lastLoginAt).toLocaleString("th-TH", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                            hour12: false, // ใช้ 24 ชั่วโมง
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
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
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

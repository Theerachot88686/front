import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Field() {
  const [fields, setFields] = useState([]); // เก็บข้อมูลฟิลด์
  const [loading, setLoading] = useState(true); // สถานะโหลดข้อมูล
  const [editingField, setEditingField] = useState(null); // ฟิลด์ที่กำลังแก้ไข
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    pricePerHour: 0,
  }); // ข้อมูลในฟอร์ม
  const [isAddFieldOpen, setIsAddFieldOpen] = useState(false); // สถานะการเปิด/ปิดฟอร์มการเพิ่มฟิลด์

  // ดึงข้อมูลฟิลด์จาก API
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/field`
        );
        setFields(response.data); // เก็บข้อมูลฟิลด์ที่ดึงมา
      } catch (error) {
        console.error("Error fetching fields:", error);
      } finally {
        setLoading(false); // เสร็จสิ้นการโหลด
      }
    };

    fetchFields();
  }, []);

  // ฟังก์ชันสำหรับการเปลี่ยนแปลงค่าฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // ฟังก์ชันสำหรับการแก้ไขฟิลด์
  const handleEditField = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/field/${editingField.id}`,
        formData
      );
      setFields((prevFields) =>
        prevFields.map((field) =>
          field.id === editingField.id ? { ...field, ...formData } : field
        )
      );
      Swal.fire({
        icon: "success",
        title: "Field Updated",
        text: "The field has been updated successfully!",
      });
      setEditingField(null); // ยกเลิกการแก้ไข
      setFormData({ name: "", location: "", pricePerHour: 0 }); // เคลียร์ฟอร์ม
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "There was an error updating the field.",
      });
      console.error("Error updating field:", error);
    }
  };

  // ฟังก์ชันสำหรับการเลือกฟิลด์ที่จะแก้ไข
  const handleEditClick = (field) => {
    setEditingField(field);
    setFormData({
      name: field.name,
      location: field.location,
      pricePerHour: field.pricePerHour,
    });
  };

  // ฟังก์ชันสำหรับการลบฟิลด์
  const handleDeleteField = async (id) => {
    try {
      const result = await Swal.fire({
        title: "ต้องการลบใช่ไหม?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/field/${id}`);
        setFields((prevFields) =>
          prevFields.filter((field) => field.id !== id)
        ); // ลบฟิลด์ออกจากสถานะ
        Swal.fire({
          icon: "success",
          title: "Field Deleted",
          text: "The field has been deleted successfully.",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: "There was an error deleting the field.",
      });
      console.error("Error deleting field:", error);
    }
  };

  // ฟังก์ชันสำหรับการเพิ่มฟิลด์ใหม่
  const handleAddField = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/field`,
        formData
      );
      setFields((prevFields) => [...prevFields, response.data]); // เพิ่มฟิลด์ใหม่ในสถานะ
      setFormData({ name: "", location: "", pricePerHour: 0 }); // เคลียร์ฟอร์ม
      setIsAddFieldOpen(false); // ปิดฟอร์ม
      Swal.fire({
        icon: "success",
        title: "Field Added",
        text: "The new field has been added successfully!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Add Failed",
        text: "There was an error adding the field.",
      });
      console.error("Error adding field:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900">สนาม</h1>
          <p className="text-gray-600 mt-2">
            View, edit, and manage all sports fields in your system
          </p>
        </div>

        {/* Button to Open Add New Field Form */}
        <div className="mb-6">
          <button
            className="btn btn-primary"
            onClick={() => setIsAddFieldOpen(true)} // เปิดฟอร์มการเพิ่มฟิลด์
          >
            เพิ่มสนาม
          </button>
        </div>

        {/* Search Section */}
        <div className="form-control w-full max-w-xs mb-6">
          <label className="label">
            <span className="label-text">ค้นหาสนาม</span>
          </label>
          <input
            type="text"
            placeholder="ค้นหา"
            className="input input-bordered w-full"
          />
        </div>

        {/* Fields Table */}
        {loading ? (
          <div className="flex justify-center mt-6">
            <div className="loader">Loading...</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>ชื่อสนาม</th>
                  <th>ที่ตั้ง</th>
                  <th>ราคา/ชั่วโมง</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td>{field.name}</td>
                    <td>{field.location}</td>
                    <td>{field.pricePerHour}</td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm mr-2"
                        onClick={() => handleEditClick(field)} // เลือกฟิลด์เพื่อแก้ไข
                      >
                        แก้ไข
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDeleteField(field.id)} // ลบฟิลด์
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

        {/* Add New Field Modal */}
        {isAddFieldOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-1/3">
              <h2 className="text-xl font-semibold mb-4">เพิ่มสนาม</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddField(); // เพิ่มฟิลด์ใหม่
                }}
              >
                <div className="mb-4">
                  <label className="label">ชื่อสนาม</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">ที่ตั้ง</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">ราคา/ชั่วโมง</label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary mr-2">
                    เพิ่ม
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsAddFieldOpen(false)} // ปิดฟอร์ม
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Field Form */}
        {editingField && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-xl shadow-xl w-1/3">
              <h2 className="text-xl font-semibold mb-4">แก้ไขสนาม</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleEditField(); // แก้ไขฟิลด์
                }}
              >
                <div className="mb-4">
                  <label className="label">ชื่อสนาม</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">ที่ตั้ง</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="label">ราคา/ชั่วโมง</label>
                  <input
                    type="number"
                    name="pricePerHour"
                    value={formData.pricePerHour}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="btn btn-primary mr-2">
                    บันทึก
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setEditingField(null)} // ปิดฟอร์ม
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

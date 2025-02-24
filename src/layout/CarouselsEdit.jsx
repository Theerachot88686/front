import React, { useState, useEffect } from "react";
import axios from "axios";

function CarouselsEdit() {
  const [carousels, setCarousels] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/car/carousels`);
      setCarousels(response.data);
    } catch (error) {
      console.error("Error fetching carousels:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("กรุณาเลือกไฟล์ก่อนอัปโหลด!");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/car/carousels`, formData);
      console.log("Image uploaded successfully!");
      setFile(null);
      fetchCarousels();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบภาพนี้?")) return;

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/car/carousels/${id}`);
      console.log("Image deleted successfully!");
      setCarousels(carousels.filter((carousel) => carousel.id !== id));
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold text-center mb-5">แก้ไขหน้าหลัก</h1>

      <div className="bg-gray-100 p-5 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Upload New Image</h2>
        <form onSubmit={handleUpload} className="flex items-center space-x-3 mt-3">
          <input type="file" accept="image/*" onChange={handleFileChange} className="file-input" />
          <button type="submit" className="btn btn-primary">Upload</button>
        </form>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">
        {carousels.map((carousel) => (
          <div key={carousel.id} className="bg-white shadow-md rounded-lg p-3 flex flex-col items-center">
<img
  src={carousel.image} // ใช้ URL ตรงจากฐานข้อมูล
  className="w-40 h-40 object-cover rounded shadow-md"
  alt="carousel"
  loading="lazy"
/>

            <button
              onClick={() => handleDelete(carousel.id)}
              className="btn btn-danger mt-3"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CarouselsEdit;

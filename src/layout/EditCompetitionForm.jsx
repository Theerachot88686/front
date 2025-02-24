import React, { useState, useEffect } from "react";
import axios from "axios";
import CarouselsEdit from "./CarouselsEdit";

function CompetitionManager() {
  const [competitions, setCompetitions] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    dec1: "",
    dec2: "",
    dec3: "",
    dec4: "",
    dec5: "",
    dec6: "",
    link: "",
    image: null,  // สถานะสำหรับเก็บไฟล์รูป
  });

  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  // ดึงข้อมูลการแข่งขันทั้งหมด
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/com/competitions`)
      .then((response) => {
        setCompetitions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching competitions:", error);
      });
  }, []);

  // ฟังก์ชันสำหรับเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ฟังก์ชันสำหรับการเลือกไฟล์รูปภาพ
  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });  // เก็บไฟล์ที่เลือก
  };

  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
  
    try {
      const response = await axios.post("https://api.imgbb.com/1/upload", formData, {
        params: {
          key: "ba9af64bebc3955c2b55f54fc52aca2f", // ใส่ API Key ของ ImgBB
        },
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      return response.data.data.url; // คืนค่า URL ของรูปที่อัปโหลดสำเร็จ
    } catch (error) {
      console.error("Error uploading image to ImgBB:", error);
      return null; // ถ้าอัปโหลดล้มเหลว ให้คืนค่า null
    }
  };
  

  // ฟังก์ชันสำหรับเพิ่มการแข่งขัน
  const handleAddCompetition = async (e) => {
    e.preventDefault();
  
    try {
      let imageUrl = null;
  
      if (formData.image) {
        imageUrl = await uploadToImgBB(formData.image);
      }
  
      const formDataToSend = {
        title: formData.title,
        dec1: formData.dec1,
        dec2: formData.dec2,
        dec3: formData.dec3,
        dec4: formData.dec4,
        dec5: formData.dec5,
        dec6: formData.dec6,
        link: formData.link,
        image: imageUrl, // ใช้ URL ของ ImgBB
      };
  
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/com/competitions`,
        formDataToSend
      );
  
      setCompetitions((prevCompetitions) => [
        ...prevCompetitions,
        response.data.competition,
      ]);
  
      setFormData({
        title: "",
        dec1: "",
        dec2: "",
        dec3: "",
        dec4: "",
        dec5: "",
        dec6: "",
        link: "",
        image: null,
      });
    } catch (error) {
      console.error("❌ Error adding competition:", error);
    }
  };
  

  // ฟังก์ชันสำหรับแก้ไขการแข่งขัน
  const handleEditCompetition = (competition) => {
    setEditMode(true);
    setEditId(competition.id);
    setFormData({
      title: competition.title,
      dec1: competition.dec1,
      dec2: competition.dec2,
      dec3: competition.dec3,
      dec4: competition.dec4,
      dec5: competition.dec5,
      dec6: competition.dec6,
      link: competition.link,
      image: null,
    });
  };

  // ฟังก์ชันสำหรับบันทึกการแก้ไข
  const handleSaveEdit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("dec1", formData.dec1);
    formDataToSend.append("dec2", formData.dec2);
    formDataToSend.append("dec3", formData.dec3);
    formDataToSend.append("dec4", formData.dec4);
    formDataToSend.append("dec5", formData.dec5);
    formDataToSend.append("dec6", formData.dec6);
    formDataToSend.append("link", formData.link);
    if (formData.image) {
      formDataToSend.append("image", formData.image);  // ส่งไฟล์รูปภาพ
    }

    axios
      .put(`${import.meta.env.VITE_API_URL}/com/competitions/${editId}`, formDataToSend)
      .then((response) => {
        const updatedCompetitions = competitions.map((comp) =>
          comp.id === editId ? response.data.competition : comp
        );
        setCompetitions(updatedCompetitions);
        setEditMode(false);
        setEditId(null);
        setFormData({
          title: "",
          dec1: "",
          dec2: "",
          dec3: "",
          dec4: "",
          dec5: "",
          dec6: "",
          link: "",
          image: null,
        });
      })
      .catch((error) => {
        console.error("Error saving competition:", error);
      });
  };

  // ฟังก์ชันสำหรับลบการแข่งขัน
  const handleDeleteCompetition = (id) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/com/competitions/${id}`)
      .then(() => {
        setCompetitions(competitions.filter((competition) => competition.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting competition:", error);
      });
  };

  return (
    <div className="container mx-auto p-6">
      {/* แสดง Carousel */}
      <CarouselsEdit />
  
      <section className="mt-6">
        <h1 className="text-2xl font-bold mb-4">การแข่งขันฟุตบอล</h1>
  
        {/* ฟอร์มสำหรับเพิ่มการแข่งขัน */}
        <form
          onSubmit={editMode ? handleSaveEdit : handleAddCompetition}
          className="bg-white shadow-md rounded-lg p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold">ชื่อการแข่งขัน:</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
  
            {["dec1", "dec2", "dec3", "dec4", "dec5", "dec6"].map((desc, index) => (
              <div key={desc}>
                <label className="block font-semibold">คำอธิบาย {index + 1}:</label>
                <textarea
                  name={desc}
                  value={formData[desc]}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            ))}
  
            <div>
              <label className="block font-semibold">แปะลิงค์:</label>
              <input
                type="text"
                name="link"
                value={formData.link}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
  
            <div>
              <label className="block font-semibold">อัปโหลดรูปภาพ:</label>
              <input
                type="file"
                name="image"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
          </div>
  
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            {editMode ? "บันทึกการเปลี่ยนแปลง" : "เพิ่มการแข่งขัน"}
          </button>
        </form>
      </section>
  
      {/* รายการการแข่งขัน */}
      <section className="mt-8">
        <h2 className="text-xl font-bold mb-4">รายการการแข่งขัน</h2>
        <ul className="space-y-4">
          {competitions.map((competition) => (
            <li
              key={competition.id}
              className="bg-gray-100 p-4 rounded-lg shadow flex flex-col md:flex-row items-center justify-between"
            >
              <div>
                <strong className="text-lg">{competition.title}</strong> - {competition.dec1}
              </div>
  
              {competition.image && (
  <img
    src={competition.image} // เปลี่ยนเป็น URL โดยตรงจากฐานข้อมูล
    alt="Competition"
    width="100"
    className="rounded mt-2 md:mt-0"
  />
)}

  
              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleEditCompetition(competition)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                >
                  แก้ไข
                </button>
                <button
                  onClick={() => handleDeleteCompetition(competition.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                >
                  ลบ
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
  
}

export default CompetitionManager;

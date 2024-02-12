import React, { useState, useEffect } from "react";
import axios from "axios";

function UserReserve() {
  const [fields, setFields] = useState([]);
  const [selectedField, setSelectedField] = useState(null);
  const handleChange = (e) => {
    setSelectedField(e.target.value);
  };
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          "http://localhost:8889/field/getfield"
        );
        setFields(response.data);
      } catch (error) {
        console.error("Error fetching fields:", error);
      }
    }
    fetchData();


  }, []);
  const hdlSubmit = async (e) => {
    try {
      e.preventDefault();
      const output = { ...input, dueDate: new Date(input.dueDate) };
      const token = localStorage.getItem("token");
      const rs = await axios.post("http://localhost:8889/booking/getbooking", output, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("เรียบร้อย จ้าาาาาา");
    } catch (err) {
      alert(err.message);
    }
  };
  

  return (
    <div class="card shrink-0 w-full max-w-sm shadow-2xl bg-base-100 mx-auto">
      <form class="card-body " onSubmit={hdlSubmit}>
        <div>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text">สนาม</span>
            </div>
            <select className="select select-bordered" onChange={handleChange}>
              <option disabled selected>
                เลือกสนาม
              </option>
              {fields.map((field) => (
                <option key={field.id} value={field.pricePerHour}>
                  {field.name}
                </option>
              ))}
            </select>
          </label>
          {selectedField && (
            <div className="form-control">
              <label className="label">
                <span className="label-text">ราคาต่อชั่วโมง</span>
              </label>
              <input
                type="text"
                placeholder={`ราคาต่อชั่วโมง: ${selectedField}`}
                className="input input-bordered"
                required
              />
            </div>
          )}
          <div class="form-control mt-6">
            <button class="btn btn-primary">ยืนยัน</button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserReserve;

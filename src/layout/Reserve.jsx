import React from "react";
import { Link } from 'react-router-dom'

function Reserve() {
  return (
    <div>
  <div className="flex justify-center items-center h-screen -mt-20">
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure>
          <img
            src="https://drive.google.com/file/d/19HRDb0cVyU1S7e0IWxSrWVyrCEkqQH8g/view?usp=drive_link"
            alt="Shoes"
            className="w-full h-72 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Pabcho Arena</h2>
          <p>1500/ชม. 7คน:ในร่ม</p>
          <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-success">จอง</Link>
          </div>
        </div>
      </div>

      </div>
    </div>
  );
}

export default Reserve;

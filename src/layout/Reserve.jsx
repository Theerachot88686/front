import React from "react";
import { Link } from 'react-router-dom'

function Reserve() {
  return (
    <div className="flex justify-center">
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure>
          <img
            src="ball.webp"
            alt="Shoes"
            className="w-full h-72 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">สนาม ทอง</h2>
          <p>1000/ชม. 7คน:ในร่ม</p>
          <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-success">จอง</Link>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure>
          <img
            src="ball2.jpg"
            alt="Shoes"
            className="w-full h-72 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">สนาม เงิน</h2>
          <p>1500/ชม. 7คน:ในร่ม</p>
          <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-success">จอง</Link>
          </div>
        </div>
      </div>
      <div className="card w-96 bg-base-100 shadow-xl m-4">
        <figure>
          <img
            src="ball3.webp"
            alt="Shoes"
            className="w-full h-72 object-cover"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">สนาม แดง</h2>
          <p>2000/ชม. 7คน:ในร่ม</p>
          <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-success">จอง</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reserve;

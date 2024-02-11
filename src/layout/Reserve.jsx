import React from "react";
import {Link} from 'react-router-dom'

function Reserve() {
  return (
    <div>
      <form className="flex justify-center">
        <div className="card w-96 bg-base-100 shadow-xl m-4">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">สนาม มังกร</h2>
            <p>1500/ชม. 7คน:ในร่ม</p>
            <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-primary">จอง</Link>
            </div>
          </div>
        </div>
        <div className="card w-96 bg-base-100 shadow-xl m-4">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">สนาม ทอง</h2>
            <p>1500/ชม. 7คน:ในร่ม</p>
            <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-primary">จอง</Link>
            </div>
          </div>
        </div>
        <div className="card w-96 bg-base-100 shadow-xl m-4">
          <figure>
            <img
              src="https://daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">สนาม อังคาร</h2>
            <p>1500/ชม. 7คน:ในร่ม</p>
            <div className="card-actions justify-end">
            <Link to="/user-reserve" className="btn btn-primary">จอง</Link>
            </div>
          </div>
        </div>
      </form>
    
    </div>
  );
}

export default Reserve;

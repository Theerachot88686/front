import React from "react";

function UserHome() {
  return (
    <div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img src="ball.webp" className="w-full h-96 object-cover" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide4" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide2" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide2" className="carousel-item relative w-full">
          <img src="ball2.jpg" className="w-full h-96 object-cover" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide1" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide3" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide3" className="carousel-item relative w-full">
          <img src="ball3.webp" className="w-full h-96 object-cover" />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
      <form className="flex justify-center">
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
              <h2 className="card-title">สนาม มังกร</h2>
              <p>1500/ชม. 7คน:ในร่ม</p>
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
              <h2 className="card-title">สนาม ทอง</h2>
              <p>1500/ชม. 7คน:ในร่ม</p>
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
              <h2 className="card-title">สนาม อังคาร</h2>
              <p>1500/ชม. 7คน:ในร่ม</p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default UserHome;

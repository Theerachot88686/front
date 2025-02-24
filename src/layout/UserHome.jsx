import React, { useState, useEffect } from "react";
import RecentCompetitions from "./RecentCompetitions";
import axios from "axios";

function UserHome() {
  const [carousels, setCarousels] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/car/carousels`)
      .then((response) => {
        setCarousels(response.data);
      })
      .catch((error) => {
        console.error("Error fetching carousels:", error);
      });
  }, []);

  return (
    <div>
      <div className="carousel w-full">
        {carousels.map((carousel, index) => (
          <div key={carousel.id} id={`slide${index + 1}`} className="carousel-item relative w-full">
            {carousel.image ? (
              <img
                src={carousel.image}
                className="w-full h-96 object-cover"
                alt={`carousel ${index + 1}`}
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center bg-gray-300">
                <p className="text-gray-600">ไม่มีรูปภาพ</p>
              </div>
            )}
            <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
              <a href={`#slide${index === 0 ? carousels.length : index}`} className="btn btn-circle">❮</a>
              <a href={`#slide${index + 2 > carousels.length ? 1 : index + 2}`} className="btn btn-circle">❯</a>
            </div>
          </div>
        ))}
      </div>


      <RecentCompetitions />

      <div className="diff aspect-[16/9]">
        <img
          alt="daisy"
          src="https://img2.pic.in.th/pic/472909631_922610796517426_6342143861772370129_n.jpg"
        />
      </div>

      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a
            href="https://www.facebook.com/profile.php?id=100063055428838"
            target="_blank"
            rel="noopener noreferrer"
            className="link link-hover text-blue-500 hover:underline"
          >
            ติดต่อ
          </a>
        </nav>

        <aside>
          <p>Copyright © 2024 - All right reserved by ACME Industries Ltd</p>
        </aside>
      </footer>
    </div>
  );
}

export default UserHome;

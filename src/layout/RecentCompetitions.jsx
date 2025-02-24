import React, { useState, useEffect } from "react";
import axios from "axios";

function RecentCompetitions() {
  const [competitions, setCompetitions] = useState([]);

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/com/recent-competitions`
        );
        setCompetitions(response.data);
      } catch (error) {
        console.error("Error fetching recent competitions:", error);
      }
    };
    fetchCompetitions();
  }, []);

  return (
    <div>
      <div className="flex justify-center mt-5">
        <div className="flex flex-wrap justify-center gap-5">
          {competitions.map((competition) => (
            <div key={competition.id} className="card w-96 bg-base-100 shadow-xl">
<figure>
  <img
    src={competition.image.startsWith("http") ? competition.image : `${import.meta.env.VITE_API_URL}/${competition.image}`}
    alt={competition.title || "รูปภาพการแข่งขัน"}
    className="w-full h-72 object-cover rounded-lg shadow-md"
    loading="lazy"
  />
</figure>

              <div className="card-body">
                <h3 className="card-title text-lg font-semibold">🏆 {competition.title}</h3>
                <p className="text-gray-800 text-lg leading-relaxed">
                  {[
                    competition.dec1 && `📌 ${competition.dec1}`,
                    competition.dec2 && `💰 ${competition.dec2}`,
                    competition.dec3 && `🆔 ${competition.dec3}`,
                    competition.dec4 && `📋 ${competition.dec4}`,
                    competition.dec5 && competition.dec5,
                    competition.dec6 && competition.dec6,
                  ]
                    .filter(Boolean)
                    .map((text, index) => (
                      <span key={index} className="block">
                        {text}
                      </span>
                    ))}
                </p>
                <a
                  href={competition.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300 mt-3"
                >
                  📄 รายละเอียดเพิ่มเติม
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecentCompetitions;

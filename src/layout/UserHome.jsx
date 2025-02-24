import React from "react";

function UserHome() {
  
  return (
    <div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img
            src="https://img2.pic.in.th/pic/1ed8eab75948a591f.jpg"
            className="w-full h-96 object-cover"
          />
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
          <img
            src="https://img2.pic.in.th/pic/475136277_933923578719481_6412863828270291943_n.jpg"
            className="w-full h-96 object-cover"
          />
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
          <img
            src="https://img2.pic.in.th/pic/472827127_922621583183014_6240810369263582286_n.jpg"
            className="w-full h-96 object-cover"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide2" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide4" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
        <div id="slide4" className="carousel-item relative w-full">
          <img
            src="https://img5.pic.in.th/file/secure-sv1/474903751_933923795386126_961337940690992895_n.jpg"
            className="w-full h-96 object-cover"
          />
          <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
            <a href="#slide3" className="btn btn-circle">
              ❮
            </a>
            <a href="#slide1" className="btn btn-circle">
              ❯
            </a>
          </div>
        </div>
      </div>
      <h1 className="card-title mt-10 ms-80">Keerati Arena Sports Club</h1>
      <form className="flex justify-center mt-5 ">
        <div className="flex justify-center">
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://img2.pic.in.th/pic/474634547_931286312316541_4509436947006918092_n.jpg"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                เปิดรับสมัคร ทีมเข้าร่วมแข่งขันฟุตบอล 6 คน
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                🏆 <strong>แข่งขันวันเสาร์ที่ 15 กุมภาพันธ์ 2568</strong>
                <br />
                📌 รับสมัคร <strong>รุ่นอายุ 9 ปี และ 13 ปี</strong> (รับรุ่นละ
                5 ทีม)
                <br />
                💰 <strong>ค่าสมัคร: 1,300 บาท</strong>
                <br />
                🆔 <strong>ใช้บัตรประชาชนตัวจริง</strong>
                <br />
                📋 ส่งรายชื่อได้ไม่เกิน <strong>15 คน</strong>
                <br />
                <br />
                <a
                  href="https://www.facebook.com/photo.php?fbid=931286308983208&set=pb.100063055428838.-2207520000&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  📄 รายละเอียดเพิ่มเติม
                </a>
              </p>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://img2.pic.in.th/pic/473007151_925731769538662_5798861503805822563_n.jpg"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                เปิดรับสมัคร ทีมเข้าร่วมแข่งขันฟุตบอล 6 คน
              </h2>
              <p className="text-gray-800 text-lg leading-relaxed">
                🏆 <strong>แข่งขันวันอาทิตย์ที่ 29 ธันวาคม 2567</strong>
                <br />
                📌 รับสมัคร <strong>
                  รุ่นอายุ 15 ปี (เกิดปี 2552)
                </strong> จำนวน <strong>16 ทีม</strong>
                <br />
                💰 <strong>ค่าสมัคร: 1,300 บาท</strong>
                <br />
                🔒 <strong>ประกันทีม: 400 บาท</strong> (รับคืนหลังจบการแข่งขัน)
                <br />
                🆔 <strong>ใช้บัตรประชาชนตัวจริง</strong>
                <br />
                📋 ส่งรายชื่อได้ไม่เกิน <strong>15 คน</strong>
                <br />
                👕 <strong>เสื้อต้องเป็นสีโทนเดียวกัน</strong>
                <br />
                <br />
                <a
                  href="https://www.facebook.com/photo.php?fbid=893125056132667&set=pb.100063055428838.-2207520000&type=3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  📄 รายละเอียดเพิ่มเติม
                </a>
              </p>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://img2.pic.in.th/pic/476630960_942209047890934_3680541933590975869_n.jpg"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                เปิดรับสมัคร ทีมเข้าร่วมแข่งขันฟุตบอล 6 คน
              </h2>
              <p className="bg-gray-100 p-4 rounded-lg shadow-md text-gray-800">
                🏆 <strong>แข่งขันวันอาทิตย์ 15 กุมภาพันธ์ 2568</strong> <br />
                📌 รับสมัคร:
                <ul className="list-disc list-inside ml-4">
                  <li>
                    <strong>รุ่นอายุ 13 ปี</strong> (2555) รับ 8 ทีม
                  </li>
                  <li>
                    <strong>รุ่นอายุ 15 ปี</strong> (2553) รับ 8 ทีม
                  </li>
                </ul>
                <br />
                💰 <strong>ค่าสมัคร:</strong> 1,200 บาท <br />
                ❌ ไม่มีประกันทีม
                <hr className="my-2" />✅ <strong>กติกา:</strong>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    ต้องใช้ <strong>บัตรประชาชนตัวจริง</strong>
                  </li>
                  <li>
                    ส่งรายชื่อได้ <strong>ไม่เกิน 15 คน</strong>
                  </li>
                  <li>
                    เสื้อต้องเป็น <strong>สีโทนเดียวกัน</strong>
                  </li>
                </ul>
                <br />
                <a
                  href="https://www.facebook.com/photo?fbid=942209044557601&set=a.333570255421486"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
                >
                  📄 รายละเอียดเพิ่มเติม
                </a>
              </p>
            </div>
          </div>
        </div>
      </form>

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

        <nav>
          <div className="grid grid-flow-col gap-4">
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
              </svg>
            </a>
            <a>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
              </svg>
            </a>
          </div>
        </nav>
        <aside>
          <p>Copyright © 2024 - All right reserved by ACME Industries Ltd</p>
        </aside>
      </footer>
    </div>
  );
}

export default UserHome;

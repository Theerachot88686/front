import React from "react";

function UserHome() {
  return (
    <div>
      <div className="carousel w-full">
        <div id="slide1" className="carousel-item relative w-full">
          <img src="https://i.postimg.cc/ncMb2tGZ/OT.jpg" className="w-full h-96 object-cover" />
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
          <img src="https://i.postimg.cc/jqH9sFgP/ball.webp" className="w-full h-96 object-cover" />
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
          <img src="https://i.postimg.cc/0ykFb0Mj/ball2.jpg" className="w-full h-96 object-cover" />
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
          <img src="https://i.postimg.cc/ZYjrJPSV/ball3.webp" className="w-full h-96 object-cover" />
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
      <h1 className="card-title mt-10 ms-80">IN CASE YOU MISSED IT</h1>
      <form className="flex justify-center mt-5 ">
        
        <div className="flex justify-center">
          
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://i.postimg.cc/NjwtjXYP/Gett.webp"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                TEN HAG: MORE YOUNGSTERS CAN BREAK THROUGH
              </h2>
              <p>
                Erik ten Hag believes there are more youngsters at Manchester
                United capable of making the breakthrough into the first team.
                Kobbie Mainoo and Alejandro Garnacho have earned regular places
                in the line-up of late, providing telling contributions to the
                cause as the Reds have made a good start to 2024.
              </p>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://i.postimg.cc/7Zs5c4pV/MCTOMINAY.jpg"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                TEN HAG: MCTOMINAY IS GIVING THE TEAM A LOT
              </h2>
              <p>
                The output produced by Manchester United midfielder Scott
                McTominay is something that is certainly being appreciated by
                his manager, Erik ten Hag. When it comes to scoring goals, the
                27-year-old is enjoying the most impactful season of his club
                career so far, netting a personal-best eight times already in
                2023/24.
              </p>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl m-5">
            <figure>
              <img
                src="https://i.postimg.cc/X7xM4zHX/Getty.webp"
                alt="Shoes"
                className="w-full h-72 object-cover"
              />
            </figure>
            <div className="card-body">
              <h2 className="card-title">
                TEN HAG: WE HAVE TO GIVE THEM TIME TO DEVELOP
              </h2>
              <p>
                Manchester United boss Erik ten Hag believes showing faith in
                our young players remains integral in adhering to the club's
                long-lasting DNA principles. Kobbie Mainoo, Rasmus Hojlund and
                Alejandro Garnacho have continued to shine for the Reds, who
                have won five of our six outings in all competitions at the
                start of 2024.
              </p>
            </div>
          </div>
        </div>
      </form>
      <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
        <li>
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-start md:text-end mb-10">
            <time className="font-mono italic">(1878–1945)</time>
            <div className="text-lg font-black">Early years</div>
            Manchester United was formed in 1878 as Newton Heath LYR Football
            Club by the Carriage and Wagon department of the Lancashire and
            Yorkshire Railway (LYR) depot at Newton Heath. The team initially
            played games against other departments and railway companies, but on
            20 November 1880, they competed in their first recorded match;
            wearing the colours of the railway company – green and gold – they
            were defeated 6–0 by Bolton Wanderers' reserve team.{" "}
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end mb-10">
            <time className="font-mono italic">(1945–1969)</time>
            <div className="text-lg font-black">Busby years</div>
            In October 1945, the impending resumption of football after the war
            led to the managerial appointment of Matt Busby, who demanded an
            unprecedented level of control over team selection, player transfers
            and training sessions. Busby led the team to second-place league
            finishes in 1947, 1948 and 1949, and to FA Cup victory in 1948. In
            1952, the club won the First Division, its first league title for 41
            years.{" "}
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-start md:text-end mb-10">
            <time className="font-mono italic">1969–1986</time>
            <div className="text-lg font-black">Bryan Robson</div>
            Following an eighth-place finish in the 1969–70 season and a poor
            start to the 1970–71 season, Busby was persuaded to temporarily
            resume managerial duties, and McGuinness returned to his position as
            reserve team coach. In June 1971, Frank O'Farrell was appointed as
            manager, but lasted less than 18 months before being replaced by
            Tommy Docherty in December 1972.{" "}
          </div>
          <hr />
        </li>
        <li>
          <hr />
          <div className="timeline-middle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-5 w-5"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="timeline-end mb-10">
            <time className="font-mono italic">(1986–2013)</time>
            <div className="text-lg font-black">Ferguson years</div>
            Alex Ferguson and his assistant Archie Knox arrived from Aberdeen on
            the day of Atkinson's dismissal, and guided the club to an
            11th-place finish in the league. Despite a second-place finish in
            1987–88, the club was back in 11th place the following season.
            Reportedly on the verge of being dismissed, Ferguson's job was saved
            by victory over Crystal Palace in the 1990 FA Cup final. The
            following season, Manchester United claimed their first UEFA Cup
            Winners' Cup title.{" "}
          </div>
          <hr />
        </li>
      </ul>
      <div className="diff aspect-[16/9]">
        <img alt="daisy" src="https://i.postimg.cc/rsFJJQSY/hojlund.webp" />
      </div>
      <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
        <nav className="grid grid-flow-col gap-4">
          <a className="link link-hover">เกี่ยวกับเรา</a>
          <a className="link link-hover">ติดต่อ</a>
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

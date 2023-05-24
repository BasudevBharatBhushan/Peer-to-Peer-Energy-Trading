import styles from "./Style/About.module.css";
import React, { useRef } from "react";
import Base from "./Base";
import { Image, Button } from "semantic-ui-react";

//Slide Image Imports
import Slide1 from "../img/About/Minor Project PPT-1.png";
import Slide2 from "../img/About/Minor Project PPT-2.png";
import Slide3 from "../img/About/Minor Project PPT-3.png";
import Slide4 from "../img/About/Minor Project PPT-4.png";
import Slide5 from "../img/About/Minor Project PPT-5.png";
import Slide6 from "../img/About/Minor Project PPT-6.png";
import Slide7 from "../img/About/Minor Project PPT-7.png";
import Slide8 from "../img/About/Minor Project PPT-8.png";
import Slide9 from "../img/About/Minor Project PPT-9.png";
import Slide10 from "../img/About/Minor Project PPT-10.png";
import Slide11 from "../img/About/Minor Project PPT-11.png";
import Slide12 from "../img/About/Minor Project PPT-12.png";
import Slide13 from "../img/About/Minor Project PPT-13.png";
import Slide14 from "../img/About/Minor Project PPT-14.png";
import Slide15 from "../img/About/Minor Project PPT-15.png";
import Slide16 from "../img/About/Minor Project PPT-16.png";
import Slide17 from "../img/About/Minor Project PPT-17.png";
import Slide18 from "../img/About/Minor Project PPT-18.png";
import Slide19 from "../img/About/Minor Project PPT-19.png";
import Slide20 from "../img/About/Minor Project PPT-20.png";
import Slide21 from "../img/About/Minor Project PPT-21.png";
import Slide22 from "../img/About/Minor Project PPT-22.png";
import Slide23 from "../img/About/Minor Project PPT-23.png";

const About = () => {
  // const scollToRef = useRef();
  const scrollSlide1 = useRef();
  const scrollSlide2 = useRef();
  const scrollSlide3 = useRef();
  const scrollSlide4 = useRef();
  const scrollSlide5 = useRef();
  const scrollSlide6 = useRef();
  const scrollSlide7 = useRef();
  const scrollSlide8 = useRef();
  const scrollSlide9 = useRef();
  const scrollSlide10 = useRef();
  const scrollSlide11 = useRef();
  const scrollSlide12 = useRef();
  const scrollSlide13 = useRef();
  const scrollSlide14 = useRef();
  const scrollSlide15 = useRef();
  const scrollSlide16 = useRef();
  const scrollSlide17 = useRef();
  const scrollSlide18 = useRef();
  const scrollSlide19 = useRef();
  const scrollSlide20 = useRef();
  const scrollSlide21 = useRef();
  const scrollSlide22 = useRef();
  const scrollSlide23 = useRef();
  const scrollSlide24 = useRef();

  const scrollTo = (ref) => {
    if (!ref.current) return;
    ref.current.scrollIntoView({ behaviour: "smooth" });
  };

  return (
    <div>
      {/* <Button
        color="black"
        onClick={() => {
          scrollTo(scollToRef);
        }}
      >
        scroll
      </Button> */}
      <Base
        title="Peer-to-Peer Energy Trading using Blockchain"
        style={{
          position: "fixed",
          top: "0",
          width: "100%",
          zIndex: "1",
          background: "white",
        }}
      />

      <div class={styles.btngroup}>
        <button
          onClick={() => {
            scrollTo(scrollSlide1);
          }}
        >
          1
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide2);
          }}
        >
          2
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide3);
          }}
        >
          3
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide4);
          }}
        >
          4
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide5);
          }}
        >
          5
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide6);
          }}
        >
          6
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide7);
          }}
        >
          7
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide8);
          }}
        >
          8
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide9);
          }}
        >
          9
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide10);
          }}
        >
          10
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide11);
          }}
        >
          11
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide12);
          }}
        >
          12
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide13);
          }}
        >
          13
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide14);
          }}
        >
          14
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide15);
          }}
        >
          15
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide16);
          }}
        >
          16
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide17);
          }}
        >
          17
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide18);
          }}
        >
          18
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide19);
          }}
        >
          19
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide20);
          }}
        >
          20
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide21);
          }}
        >
          21
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide22);
          }}
        >
          22
        </button>
        <button
          onClick={() => {
            scrollTo(scrollSlide23);
          }}
        >
          23
        </button>
      </div>

      {/* <h1 style={{ textAlign: "center" }}>
        <a
          target="._blank"
          href="https://github.com/BasudevBharatBhushan/Peer-to-Peer-Energy-Trading"
        >
          Github Repository
        </a>
      </h1>  */}
      <div ref={scrollSlide1}>
        <Image src={Slide1} className={styles.slide} />
      </div>
      <div ref={scrollSlide2}>
        <Image src={Slide2} className={styles.slide} />
      </div>
      <div ref={scrollSlide3}>
        <Image src={Slide3} className={styles.slide} />
      </div>
      <div ref={scrollSlide4}>
        <Image src={Slide4} className={styles.slide} />
      </div>
      <div ref={scrollSlide5}>
        <Image src={Slide5} className={styles.slide} />
      </div>
      <div ref={scrollSlide6}>
        <Image src={Slide6} className={styles.slide} />
      </div>
      <div ref={scrollSlide7}>
        <Image src={Slide7} className={styles.slide} />
      </div>
      <div ref={scrollSlide8}>
        <Image src={Slide8} className={styles.slide} />
      </div>
      <div ref={scrollSlide9}>
        <Image src={Slide9} className={styles.slide} />
      </div>
      <div ref={scrollSlide10}>
        <Image src={Slide10} className={styles.slide} />
      </div>
      <div ref={scrollSlide11}>
        <Image src={Slide11} className={styles.slide} />
      </div>
      <div ref={scrollSlide12}>
        <Image src={Slide12} className={styles.slide} />
      </div>
      <div ref={scrollSlide13}>
        <Image src={Slide13} className={styles.slide} />
      </div>
      <div ref={scrollSlide14}>
        <Image src={Slide14} className={styles.slide} />
      </div>
      <div ref={scrollSlide15}>
        <Image src={Slide15} className={styles.slide} />
      </div>
      <div ref={scrollSlide16}>
        <Image src={Slide16} className={styles.slide} />
      </div>
      <div ref={scrollSlide17}>
        <Image src={Slide17} className={styles.slide} />
      </div>
      <div ref={scrollSlide18}>
        <Image src={Slide18} className={styles.slide} />
      </div>
      <div ref={scrollSlide19}>
        <Image src={Slide19} className={styles.slide} />
      </div>
      <div ref={scrollSlide20}>
        <Image src={Slide20} className={styles.slide} />
      </div>
      <div ref={scrollSlide21}>
        <Image src={Slide21} className={styles.slide} />
      </div>
      <div ref={scrollSlide22}>
        <Image src={Slide22} className={styles.slide} />
      </div>
      <div ref={scrollSlide23}>
        <Image src={Slide23} className={styles.slide} />
      </div>
    </div>
  );
};

export default About;

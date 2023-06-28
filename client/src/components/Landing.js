import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import 'bootstrap/dist/css/bootstrap.min.css';

import styles from "../componentsStyles/Landing.css";
import img1 from "../resources/a1.jpg";
import img2 from "../resources/4.jpg";
import img3 from "../resources/6.jpg"

function Landing() {
  
  return (

    <div style={{height: "100vh", overflow: "hidden"}}>

      {/* <CustomNavbar/> */}

      <hr className="hr-custom" />

      <h1 style={{textAlign:"center",paddingBottom:"1vh"}}> Welcome To Examination Suite by NIIT Foundation</h1>

      <div>
        <Carousel>
          <Carousel.Item interval={5000}>
          <img
            className="d-block w-100 img-1"
            src= {img1}
            alt="First slide"
          />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img
              className="d-block w-100 img-2"
              src= {img2}
              alt="Second slide"
            />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={5000}>
            <img
              className="d-block w-100 img-3"
              src={img3}
              alt="Third slide"
            />
            <Carousel.Caption>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>

  );
}

export default Landing;
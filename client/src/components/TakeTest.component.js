import React, { useState, useEffect } from "react";
import styles from "../componentsStyles/Taketest.module.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import picture from "../resources/1.jpg"
function Taketest() {
  let history = useHistory();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pin, setpin] = useState("");
  const [imageIndex, setImageIndex] = useState(0);

  const images = [
    
    picture,
    
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setImageIndex((imageIndex + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [imageIndex, images.length]);

  const submithandler = (e) => {
    e.preventDefault();
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post("http://localhost:4000/api/test/", { pin, email, name }, options)
      .then((res) => {
        localStorage.setItem("name", name);
        localStorage.setItem("email", email);
        localStorage.setItem("pin", pin);
        history.push({
          pathname: "/test",
          state: { res: res.data },
        });
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.taketest}>
        <div className={styles.box}>
        <h1 className={styles.heading}>Take Test</h1>
        <br />
        <form onSubmit={submithandler}>
          <label className={styles.labels} htmlFor="name">
            Name:
          </label>
          <input
            className={styles.inputs}
            onChange={(e) => setname(e.target.value)}
            id="name"
            name="name"
            type="text"
          />
          <br />
          <label className={styles.labels} htmlFor="email">
            Email:
          </label>
          <input
            className={styles.inputs}
            id="email"
            name="email"
            type="email"
            onChange={(e) => setemail(e.target.value)}
          />
          <br />
          <label className={styles.labels} htmlFor="pin">
            Pin:
          </label>
          <input
            className={styles.inputs}
            onChange={(e) => setpin(e.target.value)}
            id="pin"
            name="pin"
            type="text"
          />
          <br />
          <button type="submit" className={styles.buttons}>
            Submit
          </button>
          <br />
          <br />
        </form>
        </div> 
      </div>
      
      <div className={styles.slideshowContainer}>
        <div className={styles.slideshow}>
          <img src={images[imageIndex]} alt={`image${imageIndex+1}`} />
        </div>
      </div>
    </div>
  );
}

export default Taketest;
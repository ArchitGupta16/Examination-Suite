import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../componentsStyles/LoginRegister.module.css";
import Login from "./Login.component";
import Register from "./Register.component";


function LoginRegister(props) {
  const [showLogin, setShowLogin] = useState(true);
  const [activeButton, setActiveButton] = useState("login");

  const toggleLogin = () => {
    setShowLogin(true);
    setActiveButton("login");
  };

  const toggleRegister = () => {
    setShowLogin(false);
    setActiveButton("register");
  };


  let history = useHistory();
  if (localStorage.getItem("loggedin")) history.push("/");

  return (
    
    <div className={styles.container}>
      <div className={styles.formWrapper}>
      
      <div className={styles.buttonsContainer}>
        <button className={`${styles.button} ${activeButton=="register" ? styles.activeButton:""}`} onClick={toggleLogin}>
          Login
        </button>
        <button className={`${styles.button} ${activeButton=="login" ? styles.activeButton:""}`} onClick={toggleRegister}>
          Register
        </button>
      </div>
      <div className={styles.formContainer}>
        {showLogin ? <Login {...props} /> : <Register />}
      </div>
    </div>
    </div>
    
    
  );
}

export default LoginRegister;
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import styles from "../componentsStyles/LoginRegister.module.css";
import Login from "./Login.component";
import Register from "./Register.component";


function LoginRegister(props) {
  const [showLogin, setShowLogin] = useState(true);

  const toggleLogin = () => {
    setShowLogin(true);
  };

  const toggleRegister = () => {
    setShowLogin(false);
  };

  let history = useHistory();
  if (localStorage.getItem("loggedin")) history.push("/");

  return (
    
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <button className={styles.button} onClick={toggleLogin}>
          Login
        </button>
        <button className={styles.button} onClick={toggleRegister}>
          Register
        </button>
      </div>
      <div className={styles.formContainer}>
        {showLogin ? <Login {...props} /> : <Register />}
      </div>
    </div>
    
  );
}

export default LoginRegister;
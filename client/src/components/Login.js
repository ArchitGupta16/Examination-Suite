// Login.js
import React, { useState } from "react";
import axios from "axios";
import  "../componentsStyles/Login.css"
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'
import { Modal, Form, Button, FloatingLabel } from "react-bootstrap";
import Register from "./Register.js";
import instance from "./AxiosInstance";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const alert = useAlert()
  let history = useHistory();

  const handleClose = () => {
    setShowLogin(true);
    props.handleClose();
  };

  const handleShowRegister = () => {
    setShowLogin(false);
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    instance
      .post("/api/user/login", { email, password }, options)
      .then((res) => {
        console.log(res);
        localStorage.setItem("loggedin", true);
        localStorage.setItem("auth-token", res.headers["auth-token"]);
        localStorage.setItem("name", res.data.name);
        history.push("/dashboard");
      })
      .catch((err) => {
        console.log(err);
        alert.show(err.response.data.message, { type: "error" });
      });
  };

  return (
    <Modal show={props.show} onHide={handleClose} className="mymodal" >
      <Modal.Header closeButton className="backforModal" style={{height:"7vh"}} >
        <Modal.Title ><strong>{showLogin ? "Login" : "Register"}</strong></Modal.Title>
      </Modal.Header>
      <Modal.Body className="backforModal">
      <div className="scrollable-container">
        {showLogin ? (
          <Form onSubmit={onSubmit} style={{ padding: "35px" }}>
            <Form.Group controlId="email">
              <FloatingLabel
                controlId="floatingInput"
                label="Email Address"
                className="mb-3"
              >
                <Form.Control
                  required
                  className="fieldss"
                  type="email"
                  placeholder="name@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>

            <Form.Group controlId="password">
              <FloatingLabel
                controlId="floatingInput"
                label="Password"
                className="mb-3"
              >
                <Form.Control
                  className="fieldss"
                  required
                  type="password"
                  placeholder="Name@123"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FloatingLabel>
            </Form.Group>
            <div style={{ textAlign: "center" }}>
              <Button variant="custom" type="submit" className="bnn">
                Login
              </Button>
            </div>
            <br />
            {error && <p className="text-danger">{error}</p>}
            <p style={{ textAlign: "center" }}>
              Don't have an account?{" "}
              <Button variant="link" onClick={handleShowRegister}>
                Register here
              </Button>
            </p>
          </Form>
        ) : (
          <Register handleClose={handleClose} handleShowLogin={handleShowLogin} />
        )}
      
      {!showLogin && (
        <Modal.Footer>
          <p style={{ textAlign: "center" }}>
            Already have an account?
            <Button variant="link" onClick={handleShowLogin}>
              Login
            </Button>
          </p>
        </Modal.Footer>
      )}
      </div>
      </Modal.Body>
    </Modal>
  );
}

export default Login;

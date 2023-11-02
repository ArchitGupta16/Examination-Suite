// Register.js
import React, { useState } from "react";
import "../componentsStyles/Register.css"
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'
import { Form, Button, FloatingLabel } from "react-bootstrap";
import Login from "./Login";
import instance from "./AxiosInstance";

function Register(props) {
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [c_password, setc_password] = useState("");
  const [showReg, setShowReg] = useState(true);

  const alert = useAlert()
  let history = useHistory();

  const handleClose = () => {
    setShowReg(true);
    props.handleClose();
  };

  const handleShowRegister = () => {
    setShowReg(true);
    props.handleShowLogin();
  };

  const submithandler = (e) => {
    e.preventDefault();

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    instance
      .post("/api/user/add", { name, email, password }, options)
      .then((res) => {
        alert.show("account created", { type: "success" });
        history.push('/login');
      })
      .catch((err) => {
        console.log(err.response)
        alert.show(err.response.data.message, { type: "error" });
      });
  };

  // const check = (e) => {
  //   if (password !== c_password) e.target.className = styles.inputs_pass;
  //   else e.target.className = styles.inputs;
  // };

  return (
    <div style={{ padding: '40px' }}>
      {showReg && (
        
        <Form onSubmit={submithandler}>
          <Form.Group controlId="name">
            <FloatingLabel
              controlId="floatingInput"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                className="fieldss"
                placeholder="Enter your name"
                required
                type="text"
                onChange={(e) => setname(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group controlId="email">
            <FloatingLabel
              controlId="floatingInput"
              label="Email Address"
              className="mb-3"
            >
              <Form.Control
                className="fieldss"
                placeholder="Enter your email"
                required
                type="email"
                onChange={(e) => setemail(e.target.value)}
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
                placeholder="Enter your password"
                required
                type="password"
                onChange={(e) => setpassword(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <Form.Group controlId="c_password">
            <FloatingLabel
              controlId="floatingInput"
              label="Confirm Password"
              className="mb-3"
            >
              <Form.Control
                className="fieldss"
                placeholder="Confirm your password"
                required
                type="password"
                onChange={(e) => setc_password(e.target.value)}
              />
            </FloatingLabel>
          </Form.Group>

          <br />
          <div style={{ textAlign: "center" }}>
            <Button variant="custom" type="submit" className="bn">
              Create Account
            </Button>
          </div>
        </Form>
        
      )}
      
      {!showReg && (
        <Login handleClose={handleClose} handleShowRegister={handleShowRegister} />
      )}
    </div>
  );
}

export default Register;

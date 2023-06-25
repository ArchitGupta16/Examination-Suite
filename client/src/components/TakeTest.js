import React, { useState, useEffect } from "react";
// import styles from "../componentsStyles/TakeTest.css";
import  "../componentsStyles/TakeTest.css"
import axios from "axios";
import CustomNavbar from './LandingNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'
import {Card,Button,Form,FloatingLabel } from 'react-bootstrap';
import TakeTestNavbar from "./TakeTestNavbar";

function Taketest() {
  let history = useHistory();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [pin, setpin] = useState("");
  const alert = useAlert()
  

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
        alert.show(err.response.data.message, { type: "error" });
      });
  };

  return (
    <div style={{height: "100vh", overflow: "hidden"}}>
    <TakeTestNavbar />
    <div className="bgg">
        <Card className="containerr"> 
          <Card.Body>
            <Card.Title as="h3" className="text">Take Test</Card.Title>
            <br/>
            <Form onSubmit={submithandler} > 
              
              <Form.Group controlId="name">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Name"
                  className="mb-3"
                >
                <Form.Control 
                  className="fieldss"
                  required
                  type="text"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setname(e.target.value)}
                />
              </FloatingLabel>

              <br />
              </Form.Group>
                <Form.Group controlId="email">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Email Address"
                      className="mb-3"
                    >
                  <Form.Control
                    className="fieldss"
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setemail(e.target.value)}
                  />
                  </FloatingLabel>
              </Form.Group>
              <br />

              <Form.Group controlId="pin">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Pin"
                    className="mb-3"
                  >
                <Form.Control
                  className="fieldss"
                  required
                  type="number"
                  placeholder="Enter pin"
                  value={pin}
                  onChange={(e) => setpin(e.target.value)}
                />              
              </FloatingLabel>
            </Form.Group>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="custom" className="btttn" type="submit">
                Submit
              </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </div> 
      </div>
  );
}

export default Taketest;
import React, { useState, useEffect } from "react";
// import styles from "../componentsStyles/TakeTest.css";
import  "../componentsStyles/TakeTest.css"
import axios from "axios";

import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from "react-router-dom";
import { useAlert } from 'react-alert'
import CustomNavbar from "./CustomNavbar"
import {Card,Button,Form,FloatingLabel } from 'react-bootstrap';
import aadhaarValidator from "aadhaar-validator";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


function Taketest() {
  let history = useHistory();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [pin, setpin] = useState("");
  const [parentFirstName, setParentFirstName] = useState("");
  const [parentLastName, setParentLastName] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [projectName, setProjectName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const alert = useAlert()
  

  const submithandler = (e) => {
    e.preventDefault();
    const aadhaarString = String(aadhaar);
    const isAadhaarValid = aadhaarValidator.isValidNumber(aadhaarString);
    // if (!isAadhaarValid) {
    //   alert.show("Invalid Aadhaar number. Please enter a valid 12-digit Aadhaar number.", { type: "error" });
    //   return;
    // }
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
    .post("http://localhost:4000/api/test/studentProfile", {
      aadhaar, 
      firstName,
      lastName,
      parentName: `${parentFirstName} ${parentLastName}`,
      gender,
      studentClass,
      projectName,
      state,
      city
    }, options)
    .then((res) => {
      console.log("success");
    })
    .catch((err) => {
      alert.show(err.response.data.message, { type: "error" });
    });

    axios
      .post("http://localhost:4000/api/test/", { pin, aadhaar, firstName, lastName }, options)
      .then((res) => {
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem("aadhaar", aadhaar);
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

    <div >
    <div className="bgg">
      <div className="image-container">
        <a href="/">
        <img
          src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
          alt="Logo"
          height="100"
          className="top-right-image"
        />
        </a>
       </div>
        <Card className="containerr"> 
          <Card.Body>
            <Card.Title as="h3" className="text">Take Test</Card.Title>
            <br/>
            <Form onSubmit={submithandler} > 
              
            <Row> 
            <Form.Group as={Col} controlId="firstName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="First Name"
                  className="mb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="lastName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Last Name"
                  className="mb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              </Row>
              <br />
              <Row>
                <Form.Group as={Col} controlId="aadhaar">
                    <FloatingLabel
                      controlId="floatingInput"
                      label="Aadhaar Number"
                      className="mb-4"
                    >
                  <Form.Control
                    className="fieldss"
                     
                    // type="number"
                    placeholder="Enter Aadhaar number"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                  />
                  </FloatingLabel>
              </Form.Group>
              <br />

              <Form.Group as={Col} controlId="pin">
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
            </Row>
            <br />
            <Row>
            <Form.Group as={Col} controlId="parentFirstName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Parent First Name"
                  className="mb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter parent first name"
                    value={parentFirstName}
                    onChange={(e) => setParentFirstName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="parentLastName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Parent Last Name"
                  className="mb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter parent last name"
                    value={parentLastName}
                    onChange={(e) => setParentLastName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              </Row>
              <br />
              <Row>
              <Form.Group as={Col} controlId="gender">
                <FloatingLabel controlId="floatingSelect" label="Gender" className="mb-3">
                  <Form.Select
                    aria-label="Select Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </FloatingLabel>
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="studentClass">
                {/* <Form.Label>Student Class</Form.Label> */}
                <Form.Control
                  as="select"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                >
                  <option value="">Select Class</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </Form.Control>
              </Form.Group>
              </Row>
              <br />
              <Form.Group controlId="projectName">
                <Form.Label>Project Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </Form.Group>
              <br />
              <Row>
              <Form.Group as={Col} controlId="state">
                <FloatingLabel
                  controlId="floatingInput"
                  label="State"
                  className="mb-3"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="city">
                <FloatingLabel
                  controlId="floatingInput"
                  label="City"
                  className="mb-3"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              </Row>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button variant="success" className="btttn" type="submit">
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
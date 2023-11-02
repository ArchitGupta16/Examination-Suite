import React, { useState, useEffect } from "react";
import  "../componentsStyles/TakeTest.css"
import axios from "axios";
import instance from "./AxiosInstance";
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
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [projectName, setProjectName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [testID, setTestID] = useState("");
  const [dob, setDob] = useState("");
  const [ration, setRation] = useState("");
  const [documentType, setDocumentType] = useState("");
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
    instance
    .post("/api/test/studentProfile", {
      aadhaar, 
      ration,
      firstName,
      lastName,
      fatherName,
      motherName,
      gender,
      studentClass,
      projectName,
      state,
      city,
      dob
    }, options)
    .then((res) => {
      console.log("success",res.data);
      setTestID(res.data.ID);
      localStorage.setItem("testID", res.data.ID);
    })
    .catch((err) => {
      alert.show(err.response.data.message, { type: "error" });
    });

    instance
      .post("/api/test/", { pin, [documentType]: documentType === "aadhaar" ? aadhaar : ration, firstName, lastName }, options)
      .then((res) => {
        localStorage.setItem("firstName", firstName);
        localStorage.setItem("lastName", lastName);
        localStorage.setItem(documentType, documentType === "aadhaar" ? aadhaar : ration);
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

    <div className="imc" >
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
                  className="mbb-4"
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
                  className="mbb-4"
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
                
                <Form.Group as={Col} controlId="documentType">
                {/* <Form.Label>Select Document Type</Form.Label> */}
                <Form.Control
                  as="select"
                  value={documentType}
                  className="fieldss"
                  
                  onChange={(e) => setDocumentType(e.target.value)}
                  style={{padding:"15px"}}
                >
                  <option value="" className="text-change">Select Document Type</option>
                  <option value="aadhaar">Aadhaar Card</option>
                  <option value="ration">Ration Card</option>
                </Form.Control>
              </Form.Group>

              {documentType === "aadhaar" && (
                <Form.Group as={Col} controlId="aadhaar">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Aadhaar Number"
                    className="mbb-4"
                  >
                    <Form.Control
                      className="fieldss"
                      type="text"
                      placeholder="Enter Aadhaar number"
                      value={aadhaar}
                      onChange={(e) => setAadhaar(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
              )}

              {documentType === "ration" && (
                <Form.Group as={Col} controlId="ration">
                  <FloatingLabel
                    controlId="floatingInput"
                    label="Ration Card Number"
                    className="mbb-4"
                  >
                    <Form.Control
                      className="fieldss"
                      type="text"
                      placeholder="Enter Ration card number"
                      value={ration}
                      onChange={(e) => setRation(e.target.value)}
                    />
                  </FloatingLabel>
                </Form.Group>
              )}
              <br />

              <Form.Group as={Col} controlId="pin">
                <FloatingLabel
                    controlId="floatingInput"
                    label="Pin"
                    className="mbb-4"
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
            <Form.Group as={Col} controlId="fatherName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Father's Name"
                  className="mbb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter Father's name"
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="motherName">
                <FloatingLabel
                  controlId="floatingInput"
                  label="Mother's Name"
                  className="mbb-4"
                >
                  <Form.Control
                    className="fieldss"
                     
                    type="text"
                    placeholder="Enter mother's name"
                    value={motherName}
                    onChange={(e) => setMotherName(e.target.value)}
                  />
                </FloatingLabel>
              </Form.Group>
              </Row>
              <br />
              <Row>
              <Form.Group as={Col} controlId="gender">
                {/* <FloatingLabel controlId="floatingSelect" label="Gender" className="mbb-4"> */}
                  <Form.Select
                    aria-label="Select Gender"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="fieldss"
                    style={{padding:"15px"}}
                  >
                    <option value="" className="text-change">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                {/* </FloatingLabel> */}
              </Form.Group>
              <br />
              <Form.Group as={Col} controlId="studentClass">
                {/* <Form.Label>Student Class</Form.Label> */}
                <Form.Control
                  as="select"
                  value={studentClass}
                  onChange={(e) => setStudentClass(e.target.value)}
                  className="fieldss"
                  style={{padding:"15px"}}
                  
                >
                 
                  <option value="" className="text-change" >Select Class</option>
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
              <Form.Group controlId="dob">
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter date of birth"
                  value={dob}
                  className="fieldss"
                  onChange={(e) => setDob(e.target.value)}
                  style={{fontSize:"small"}}
                />
              </Form.Group>

              <br/>
              <Form.Group controlId="projectName">
                <Form.Label className="mbb-4">Project Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="fieldss"
                  style={{fontSize:"small"}}
                />
              </Form.Group>
              <br />
              <Row>
              <Form.Group as={Col} controlId="state">
                <FloatingLabel
                  controlId="floatingInput"
                  label="State"
                  className="mbb-4"
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
                  className="mbb-4"
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
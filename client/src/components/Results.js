import React from "react";
import { Container, Row, Col, Table, Button, Card ,Form,Modal} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../componentsStyles/Results.css";
import { useAlert } from "react-alert";
import { ratio as fuzzballRatio } from 'fuzzball';
import one from "../resources/t1.jpg";
import two from "../resources/t2.jpg";
import three from "../resources/t3.jpg";
import four from "../resources/t4.jpg";
import six from "../resources/p2.jpg";
import seven from "../resources/p3.jpeg";
import eight from "../resources/p4.jpg";

const images = [one, two, three, six,four,  seven, eight];

function TestResults({ location }) {
  const [data, setData] = useState(location.state && location.state.data);
  const testDetails = location.state && location.state.testdetails;
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [attemptFilter, setAttemptFilter] = useState("");
  const expiryDate = new Date(testDetails.expiry).toISOString().substr(0, 10);
  const [showModal, setShowModal] = useState(false);
  const [testID, setTestID] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [ration, setRation] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [motherName, setMotherName] = useState("");
  const [gender, setGender] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [projectName, setProjectName] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [dob, setDob] = useState("");
  const [pin, setPin] = useState("");
  const [score, setScore] = useState(0);
  const  alert  = useAlert();
  const [idType, setIdType] = useState("aadhaar");

  useEffect(() => {

    getResults(testDetails?.pin);
    
    if (data) {
      data.forEach((result) => {
        getprofile(result.testID);
      });
    }


  }, []);
  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token")
    },
  };

  const getResults = (pin) => {
    axios.post(
      "http://localhost:4000/api/test/getresults",
      {pin},
      options
    )
    .then((res) => {
      console.log(res,"got the results guyss",);
      setData(res.data);
    })
    .catch((err) => {
      console.log("error here buddy",err.response.body)
    })
  }

  const getprofile = (testID) => {
    console.log(testID);
    axios
      .post("http://localhost:4000/api/test/getStudentProfile", { testID })
      .then((res) => {
        const { state, city, projectName, gender,attempts } = res.data;
        setData((prevData) => {
          const updatedData = prevData.map((result) => {
            if (result.testID === testID) {
              return {
                ...result,
                state,
                city,
                projectName,
                gender,
                attempts
              };
            }
            return result;
          });
          // console.log(updatedData);
          return updatedData;
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };
  

  const handleCityFilterChange = (event) => {
    setCityFilter(event.target.value);
  };

  const handleStateFilterChange = (event) => {
    setStateFilter(event.target.value);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleProjectFilterChange = (event) => {
    setProjectFilter(event.target.value);
  };
  const handleAttemptFilterChange = (event) => {
    setAttemptFilter(event.target.value);
  };

  let filteredData = data;
  
  const fuzzyFilter = (input, filter) => {
    if (typeof input !== 'string') {
      return input === filter;
    }
    const inputLower = input.toLowerCase();
    const filterLower = filter.toLowerCase();
    const similarity = fuzzballRatio(inputLower, filterLower);
    const threshold = 60; 
  
    return similarity >= threshold;
  };
  
  if (cityFilter) {
    filteredData = filteredData.filter((result) => fuzzyFilter(result.city, cityFilter));
  }
  if (stateFilter) {
    filteredData = filteredData.filter((result) => fuzzyFilter(result.state, stateFilter));
  }
  if (projectFilter) {
    filteredData = filteredData.filter((result) => fuzzyFilter(result.projectName, projectFilter));
  }
  if (genderFilter) {
    filteredData = filteredData.filter(
      (result) => result.gender.toLowerCase() === genderFilter.toLowerCase()
    );
  }
  if (attemptFilter){
    filteredData = filteredData.filter((result) => result.attempts == attemptFilter);
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <hr className="hr-custom" />
        <Container className="mt-5">
          <h1 className="text-center">Test Results</h1>
          <p className="text-center">No results found.</p>
        </Container>
      </div>
    );
  }

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleModalShow = () => {
    setShowModal(true);
  };


  const handleIdTypeChange = (event) => {
    setIdType(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    const requestData = {
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
      dob,
    };
  
    axios
      .post("http://localhost:4000/api/test/studentProfile", requestData, options)
      .then((res) => {
        console.log("success", res.data);
        setTestID(res.data.ID);
        localStorage.setItem("testID", res.data.ID);
  
        const submitData = {
          pin: testDetails.pin,
          aadhaar,
          testID: localStorage.getItem("testID"), 
          firstName,
          score,
        };

        console.log(submitData);
  
        return axios.post("http://localhost:4000/api/test/submittest", submitData, options);
        
      })
      .then((res) => {
        console.log(res);
        alert.show("Test result added", { type: "success" });
        setShowModal(false);
      })
      .catch((err) => {
        console.log(err.response.data);
        alert.show(err.response.data.msg, { type: "error" });
      });
  };
  return (
    <div className="mybg">
      <hr className="hr-custom" />
      <Container fluid className="mt-5">
        <Row>
          <Col lg={3} md={4} sm={12} className="mb-4">
            <div className="bothcards">
            <Card className=" mycard2 shadow" border="">
              
              <Card.Img variant="top" style={{height:"20vh"}} src={images[0]} alt="Test Image" />
              <div className="d-flex justify-content-center">
              <hr className="my-3" style={{width:"85%"}}/>
              </div>
              <Card.Body>
                
                <Card.Text>
                  <strong>Pin:</strong> {testDetails.pin}
                  <br />
                  <strong>Topic:</strong> {testDetails.topic}
                  <br />
                  <strong>Number of Questions:</strong> {testDetails.amount}
                  <br />
                  <strong>Expiry:</strong> {expiryDate}
                </Card.Text>
              </Card.Body>
            </Card>
          
            <Card className=" mt-5 mycard2 shadow" border="">
              <Card.Body>
                <Card.Title><strong>Filters</strong></Card.Title>
                <br />
                <Card.Text>
                      <div className="form-group">
                        <label htmlFor="city-filter"><strong>City:</strong></label>
                        <input
                          type="text"
                          className="form-control customfield"
                          id="city-filter"
                          value={cityFilter}
                          onChange={handleCityFilterChange}
                        />
                      </div>
                      <br />
                      <div className="form-group">
                        <label htmlFor="state-filter"><strong>State:</strong></label>
                        <input
                          type="text"
                          className="form-control customfield"
                          id="state-filter"
                          value={stateFilter}
                          onChange={handleStateFilterChange}
                        />
                      </div>

                  <br />
                  <div className="form-group">
                    <label htmlFor="project-filter"><strong>Project:</strong></label>
                    <input
                      type="text"
                      className="form-control customfield"
                      id="project-filter"
                      value={projectFilter}
                      onChange={handleProjectFilterChange}
                    />
                  </div>
                  <br />
                      <div className="form-group">
                        <label htmlFor="attempt-filter"><strong>Attempt:</strong></label>
                        <input
                          type="number"
                          className="form-control customfield"
                          id="attempt-filter"
                          value={attemptFilter}
                          onChange={handleAttemptFilterChange}
                        />
                      </div>
                      <br />
                      <div className="form-group">
                        <label htmlFor="gender-filter"><strong>Gender:</strong></label>
                        <select
                          className="form-control customfield"
                          id="gender-filter"
                          value={genderFilter}
                          onChange={handleGenderFilterChange}
                        >
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    {/* </Col>
                  </Row> */}
                </Card.Text>
              </Card.Body>
            </Card>
            </div>
          </Col>
          <Col lg={9} md={8} sm={12}>
            <Container>
              <div className="d-none d-md-block">
                <div className="d-flex justify-content-end" style={{marginBottom:"2vh"}}>
                  <Button variant="custom" className="buttong " onClick={handleModalShow}>
                    Add Result
                  </Button>
                </div>
                <Table striped bordered hover responsive variant="custom" border="dark">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>TestID</th>
                      <th>Score</th>
                      <th>Attempts</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Project</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((result, index) => (
                      <tr key={index}>
                        <td>{result.firstName}</td>
                        <td>{result.gender}</td>
                        <td>{result.testID}</td>
                        <td>{result.score}%</td>
                        <td>{result.attempts}</td>
                        <td>{result.city}</td>
                        <td>{result.state}</td>
                        <td>{result.projectName}</td>
                        <td>
                          <Link
                            to={{
                              pathname: "/grade",
                              state: { student: result },
                            }}
                          >
                            <Button variant="custom" className="buttonss">Edit Score</Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <Modal show={showModal} onHide={handleModalClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Result</Modal.Title>
                  </Modal.Header>
                    <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                      <strong>Pin:</strong> {testDetails.pin}
                      <Form.Group>
                        <br />
                        <Form.Label style={{marginRight:"2vw"}}><strong>Select:</strong></Form.Label>
                          <Form.Check
                            inline
                            type="radio"
                            label="Aadhaar"
                            name="idTypeRadio"
                            value="aadhaar"
                            checked={idType === "aadhaar"}
                            onChange={handleIdTypeChange}
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Ration Card"
                            name="idTypeRadio"
                            value="rationCard"
                            checked={idType === "rationCard"}
                            onChange={handleIdTypeChange}
                          />
                      </Form.Group>
                      <br />

                      <Form.Group controlId="formIdNumber">
                        <Form.Label>
                          <strong>{idType === "aadhaar" ? "Aadhaar Number" : "Ration Card Number"}</strong>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          placeholder={`Enter ${idType === "aadhaar" ? "Aadhaar" : "Ration Card"} number`}
                          value={idType === "aadhaar" ? aadhaar : ration}
                          onChange={(e) =>
                            idType === "aadhaar"
                              ? setAadhaar(e.target.value)
                              : setRation(e.target.value)
                          }
                        />
                      </Form.Group>
                      <br />

                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="firstName">
                            <Form.Label><strong>First Name</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter first name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group controlId="lastName">
                            <Form.Label><strong>Last Name</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter last name"
                              value={lastName}
                              onChange={(e) => setLastName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />

                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="fatherName">
                            <Form.Label><strong>Father's Name</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter father's name"
                              value={fatherName}
                              onChange={(e) => setFatherName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group controlId="motherName">
                            <Form.Label><strong>Mother's Name</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter mother's name"
                              value={motherName}
                              onChange={(e) => setMotherName(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />

                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="gender">
                            <Form.Label><strong>Gender</strong></Form.Label>
                            <Form.Control
                              as="select"
                              value={gender}
                              onChange={(e) => setGender(e.target.value)}
                            >
                              <option>Choose...</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="other">Other</option>
                            </Form.Control>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group controlId="studentClass">
                            <Form.Label><strong>Class</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter class"
                              value={studentClass}
                              onChange={(e) => setStudentClass(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />

                      <Form.Group controlId="projectName">
                        <Form.Label><strong>Project Name</strong></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter project name"
                          value={projectName}
                          onChange={(e) => setProjectName(e.target.value)}
                        />
                      </Form.Group>
                      <br />

                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="city">
                            <Form.Label><strong> City</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter city"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group controlId="state">
                            <Form.Label><strong>State</strong></Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter state"
                              value={state}
                              onChange={(e) => setState(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      
                      <Row>
                        <Col sm={6}>
                          <Form.Group controlId="dob">
                            <Form.Label><strong>Date of Birth</strong></Form.Label>
                            <Form.Control
                              type="date"
                              placeholder="Enter date of birth"
                              value={dob}
                              onChange={(e) => setDob(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      <br />
                        <Col sm={6}>
                          <Form.Group controlId="score">
                            <Form.Label><strong>Score</strong></Form.Label>
                            <Form.Control
                              type="number"
                              placeholder="Enter score"
                              value={score}
                              onChange={(e) => setScore(e.target.value)}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <br />
                      
                      <div className="d-flex justify-content-end">
                      <Button variant="custom" style={{margin:"2% 2% 0% 2%"}} className="buttong" onClick={handleModalClose}>
                        Close
                      </Button>
                      <Button variant="custom" style={{margin:"2% 2% 0% 2%"}} type="submit" className="buttonss">
                        Save Changes
                      </Button>
                      </div>
                    </Form>
                  </Modal.Body>
                </Modal>
              </div>
              <div className="d-md-none">
                {filteredData.map((result, index) => (
                  <Card className="shadow mb-3" key={index}>
                    <Card.Body>
                      <Card.Title>{result.name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">
                        {result.gender}
                      </Card.Subtitle>
                      <Card.Text>
                        <strong>TestID:</strong> {result.testID}
                        <br />
                        <strong>Score:</strong> {result.score}%
                        <br />
                        <strong>City:</strong> {result.city}
                        <br />
                        <strong>State:</strong> {result.state}
                      </Card.Text>
                      <Link
                        to={{
                          pathname: "/grade",
                          state: { student: result },
                        }}
                      >
                        <Button variant="primary">Edit Score</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </Container>
          </Col>
        </Row>
      </Container>
    </div>
      )
}

export default TestResults;
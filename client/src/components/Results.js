import React from "react";
import { Container, Row, Col, Table, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import "../componentsStyles/Results.css";
function TestResults({ location }) {
  const [data, setData] = useState(location.state && location.state.data);
  const testDetails = location.state && location.state.testdetails;
  const [cityFilter, setCityFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const expiryDate = new Date(testDetails.expiry).toISOString().substr(0, 10);

  const getprofile = (testID) => {
    console.log(testID);
    axios
      .post("http://localhost:4000/api/test/getStudentProfile", { testID })
      .then((res) => {
        const { state, city, projectName, gender } = res.data;
        setData((prevData) => {
          const updatedData = prevData.map((result) => {
            if (result.testID === testID) {
              return {
                ...result,
                state,
                city,
                projectName,
                gender,
              };
            }
            return result;
          });
          console.log(updatedData);
          return updatedData;
        });
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  useEffect(() => {
    if (data) {
      data.forEach((result) => {
        getprofile(result.testID);
      });
    }
  }, []);

  const handleCityFilterChange = (event) => {
    setCityFilter(event.target.value);
  };

  const handleStateFilterChange = (event) => {
    setStateFilter(event.target.value);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
  };

  let filteredData = data;
  if (cityFilter) {
    filteredData = filteredData.filter(
      (result) => result.city.toLowerCase() === cityFilter.toLowerCase()
    );
  }
  if (stateFilter) {
    filteredData = filteredData.filter(
      (result) => result.state.toLowerCase() === stateFilter.toLowerCase()
    );
  }
  if (genderFilter) {
    filteredData = filteredData.filter(
      (result) => result.gender.toLowerCase() === genderFilter.toLowerCase()
    );
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

  return (
    <div className="mybg">
      <hr className="hr-custom" />
      <Container fluid className="mt-5">
        <Row>
          <Col lg={3} md={4} sm={12} className="mb-4">
            <Card className=" mycard1">
              <Card.Body>
                <Card.Title>Test Details</Card.Title>
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

            <Card className=" mt-5 mycard2">
              <Card.Body>
                <Card.Title>Filters</Card.Title>
                <Card.Text>
                  <div className="form-group">
                    <label htmlFor="city-filter">City:</label>
                    <input
                      type="text"
                      className="form-control customfield"
                      id="city-filter"
                      value={cityFilter}
                      onChange={handleCityFilterChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state-filter">State:</label>
                    <input
                      type="text"
                      className="form-control customfield"
                      id="state-filter"
                      value={stateFilter}
                      onChange={handleStateFilterChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender-filter">Gender:</label>
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
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={9} md={8} sm={12}>
            <Container>
              <div className="d-none d-md-block">
                <Table striped bordered hover responsive variant="custom">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Gender</th>
                      <th>TestID</th>
                      <th>Score</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((result, index) => (
                      <tr key={index}>
                        <td>{result.name}</td>
                        <td>{result.gender}</td>
                        <td>{result.testID}</td>
                        <td>{result.score}%</td>
                        <td>{result.city}</td>
                        <td>{result.state}</td>
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
import React from "react";
import { Container, Row, Col, Table, Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";


function TestResults({ location }) {
  const data = location.state && location.state.data;
  const testDetails = location.state && location.state.testdetails;

  if (!data || data.length === 0) {
    return (
      <div >
      {/* <CustomNavbar  /> */}
      <hr className="hr-custom" />
      <Container className="mt-5">
        <h1 className="text-center">Test Results</h1>
        <p className="text-center">No results found.</p>
      </Container>
      </div>
    );
  }

  return (
    <div >
      {/* <CustomNavbar  /> */}
      <hr className="hr-custom" />
    <Container fluid className="mt-5">
      
      <Row>
        <Col lg={3} md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Test Details</Card.Title>
              <Card.Text>
                <strong>Pin:</strong> {testDetails.pin}<br />
                <strong>Topic:</strong> {testDetails.topic}<br />
                <strong>Number of Questions:</strong> {testDetails.questions}<br />
                <strong>Expiry:</strong> {testDetails.expiry}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={9} md={6}>
          <Container>
            <Table striped bordered hover responsive variant="custom">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Score</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((result, index) => (
                  <tr key={index}>
                    <td>{result.name}</td>
                    <td>{result.email}</td>
                    <td>{result.score}%</td>
                    <td>
                      <Link
                        to={{
                          pathname: "/grade",
                          state: {  student : result },
                        }}
                      >
                        <Button variant="primary">Edit Score</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Container>
        </Col>
      </Row>
    </Container>
    </div>
  );
}

export default TestResults;

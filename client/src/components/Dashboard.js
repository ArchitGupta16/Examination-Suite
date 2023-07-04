import React, { useState, useEffect } from "react";
import { useHistory,Link } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal } from "react-bootstrap";
import one from "../resources/1.jpg";
import two from "../resources/p2.jpg";
import three from "../resources/p3.jpeg";
import four from "../resources/p4.jpg";

const images = [one, two, three, four];

function Dashboard(props) {
  let history = useHistory();
  if (!localStorage.getItem("auth-token")) {
    localStorage.clear();
    history.push("/");
  }
  const [tests, setTests] = useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [topic, settopic] = useState("");
  const [amount, setamount] = useState("");
  const [time, settime] = useState("");
  const [expiry, setexpiry] = useState(new Date());
  const [alert, setAlert] = useState({ show: false, message: "", variant: "" });

  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token"),
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
      history.push("/test-results", { data: res.data, testdetails : tests.find((test) => test.pin === pin) });
    })
    .catch((err) => {
      console.log("error here buddy",err.response.body)
    })
  }
  const getQuestions=(pin)=>{
    axios.post(
      "http://localhost:4000/api/test/getquestions",
      {pin}
    )
    .then((res) => {
      console.log(res,"got the question guyss",);
      history.push("/Edittest", { data: res.data, testdetails : tests.find((test) => test.pin === pin) });
    })
    .catch((err) => {
      console.log("error here buddy",err.response.body)
    })
  }

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/test/gettests", {}, options)
      .then((res) => {
        setTests(res.data);
      })
      .catch((err) => {
        if (!localStorage.getItem("auth-token")) history.push("/");
        else setAlert({ show: true, message: "Couldn't fetch tests. Please reload the page.", variant: "danger" });
      });
  }, [modalIsOpen]);

  

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:4000/api/test/addtest",
        { topic, amount, time, expiry, created: new Date() },
        options
      )
      .then((res) => {
        console.log("added");
        setmodalIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        setAlert({ show: true, message: "Error: Test not added. Please try again.", variant: "danger" })
      });
  };

  return (
    <div>
      {/* <CustomNavbar page="dashboard"/> */}
      {/* <CustomNavbar  loggedin={props.loggedin} setloggedin={props.setloggedin} /> */}
      <hr className="hr-custom" />
      <div className="container mt-5">
        <h1 className="text-center mb-4">Welcome {localStorage.getItem("name")}</h1>
        <div className="d-flex justify-content-end mb-4">
          <Button variant="primary" onClick={() => setmodalIsOpen(true)}>
            + Add Test
          </Button>
        </div>
        <div className="row row-cols-1 row-cols-md-3 g-4">
        {tests.map((test,index) => (
          <div className="col" key={test._id}>
            <Card>
              {/* Add Card Image */}
              <Card.Img variant="top" style={{ width: "100%",height:"20vh" }} src={images[index % images.length]} alt="Test Image" />

              <Card.Body>
                <Card.Title>{test.testname}</Card.Title>
                <Card.Text>
                  <strong>Pin:</strong> {test.pin}
                  <br />
                  <strong>Number of Questions:</strong> {test.amount}
                  <br />
                  <strong>Time Duration (Mins):</strong> {test.time}
                  <br />
                  <strong>Expiry:</strong>{" "}
                  {new Date(test.expiry).toLocaleDateString()}
                </Card.Text>
                <Button variant="primary" onClick={() => getResults(test.pin)}>
                  View Results
                </Button>
                <Button
                  variant="primary"
                  onClick={() => getQuestions(test.pin)}
                  style={{ marginLeft: "10px", marginTop: "2px" }}
                >
                  Edit Test
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}

        </div>
      </div>

      {/* Add Test Modal */}
      <Modal show={modalIsOpen} onHide={() => setmodalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {alert.show && <Alert variant={alert.variant}>{alert.message}</Alert>}
          <Form onSubmit={onSubmit}>
          <Form.Group controlId="formBasicNumber">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter name of test"
                value={topic}
                onChange={(event) => settopic(event.target.value)}
              />
              </Form.Group>
            <Form.Group controlId="formBasicNumber">
              <Form.Label>Number of Questions</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of questions"
                min="1"
                value={amount}
                onChange={(event) => setamount(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicTime">
              <Form.Label>Time Duration (in minutes)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter time duration (in minutes)"
                min="1"
                value={time}
                onChange={(event) => settime(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBasicExpiry">
              <Form.Label>Expiry Date</Form.Label>
              <Form.Control
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={expiry}
                onChange={(event) => setexpiry(event.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Add Test
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Dashboard;
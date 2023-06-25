import React, { useState, useEffect } from "react";
// import Test from "./TestElement.component";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal } from "react-bootstrap";

const topics = [
  { id: 1, name: "<--select category-->" },
  { id: 2, name: "EVS" },
  { id: 3, name: "Math" },
  { id: 4, name: "English" },
  { id: 5, name: "Computer" },
];

function Dashboard() {
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

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/test/gettests", {}, options)
      .then((res) => {
        for (let x of res.data) {
          for (let y of topics) {
            if (y["id"] == x["topic"]) x.topicname = y["name"];
          }
        }
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
    <div className="container mt-5">
      <h1 className="text-center mb-4">Welcome {localStorage.getItem("name")}</h1>
      <div className="d-flex justify-content-end mb-4">
        <Button variant="primary" onClick={() => setmodalIsOpen(true)}>
          + Add Test
        </Button>
      </div>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {tests.map((test) => (
          <div className="col" key={test._id}>
            <Card>
              <Card.Body>
                <Card.Title>{test.topicname}</Card.Title>
                <Card.Text>
                  <strong>Pin:</strong> {test.pin}<br />
                  <strong>Number of Questions:</strong> {test.amount}<br />
                  <strong>Time Duration (Mins):</strong> {test.time}<br />
                  <strong>Expiry:</strong> {new Date(test.expiry).toLocaleDateString()}
                </Card.Text>
                <Button variant="primary" onClick={()=>getResults(test.pin)} >View Results</Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
      <Modal show={modalIsOpen} onHide={() => setmodalIsOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Test</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit}>
            <Form.Group controlId="topic">
              <Form.Label>Topic:</Form.Label>
              <Form.Control as="select" value={topic} onChange={(e) => settopic(e.target.value)}>
                {topics.map((obj) => (
                  <option key={obj.id} value={obj.id}>
                    {obj.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="amount">
              <Form.Label>Number of Questions:</Form.Label>
              <Form.Control type="text" value={amount} onChange={(e) => setamount(e.target.value)} />
            </Form.Group>        
              <Form.Group controlId="time">
              <Form.Label>Time Duration (Mins):</Form.Label>
              <Form.Control type="text" value={time} onChange={(e) => settime(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="expiry">
              <Form.Label>Expiry:</Form.Label>
              <Form.Control type="date" value={expiry} onChange={(e) => setexpiry(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      {alert.show && (
        <Alert variant={alert.variant} className="mt-4">
          {alert.message}
        </Alert>
      )}
    </div>
  );
}

export default Dashboard;
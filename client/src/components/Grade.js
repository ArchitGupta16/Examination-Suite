import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, ListGroup } from "react-bootstrap";
import DashboardNavbar from "./DashboardNavbar";

function Grade({ location }) {
  const answers = location.state && location.state.student.result;
  const testPin = location.state && location.state.student.pin;

  const [data, setData] = useState([]);

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const getQuestions = (testPin) => {
    axios
      .post("http://localhost:4000/api/test/getquestions", { pin: testPin }, options)
      .then((res) => {
        setData(res.data);
        console.log(data[0], "Test questions and answer here");
      })
      .catch((err) => {
        console.log("error here", err.response.body);
      });
  };

  useEffect(() => {
    getQuestions(testPin);
  }, []);

  const [scores, setScores] = useState({});

  const handleScoreChange = (questionIndex, score) => {
    setScores((prevScores) => ({
      ...prevScores,
      [questionIndex]: score,
    }));
  };
  
  const renderQuestion = (question, index) => {
    if (question.type === "multiple") {
      const options = [...question.incorrect_answers, ...question.correct_answer];
      // Shuffle the options array if needed

      return (
        <div key={index}>
          <Card>
            <Card.Body>
              <Card.Title>Question {index + 1}</Card.Title>
              <Card.Text>{question.question}</Card.Text>
              <ListGroup>
                {options.map((option, optionIndex) => (
                  <ListGroup.Item key={optionIndex}>
                    <Form.Check
                      type="radio"
                      id={`option-${index}-${optionIndex}`}
                      label={option}
                      name={`question-${index}`}
                      value={option}
                      checked={answers && answers[index] === option} // Set the checked state based on student's answer
                      disabled // Disable the input field to prevent editing
                    />
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
          <br />
        </div>
      );
    } else if (question.type === "text") {
      return (
        <div key={index}>
          <Card>
            <Card.Body>
              <Card.Title>Question {index + 1}</Card.Title>
              <Card.Text>{question.question}</Card.Text>
              <Form.Control
                type="text"
                value={answers && answers[index]} // Set the value of the input field to student's answer
                readOnly // Make the input field read-only
              />
              <br />
              <Form.Control
                type="number"
                placeholder="Enter Score"
                value={scores[index] || ""}
                onChange={(e) => handleScoreChange(index, e.target.value)}
              />
            </Card.Body>
          </Card>
          <br />
        </div>
      );
    }
  };

  return (
    <div>
      <DashboardNavbar />
      <br />
      <div className="container">
        {data.map((question, index) => renderQuestion(question, index))}
      </div>
    </div>
  );
}

export default Grade;

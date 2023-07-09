import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, ListGroup, Nav,Accordion } from "react-bootstrap";
import { useAlert } from "react-alert";
import "../componentsStyles/Grade.css"
function Grade({ location }) {
  const answers = location.state && location.state.student.result;
  const testPin = location.state && location.state.student.pin;
  const individual = location.state && location.state.student.individualScore;
  const aadhaar = location.state && location.state.student.aadhaar;
  const [data, setData] = useState([]);
  const [scores, setScores] = useState({});
  const [updatedScores, setUpdatedScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [updatedScore, setUpdatedScore] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState(0);
  const alert = useAlert();
  const history = useHistory();

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
      })
      .catch((err) => {
        console.log("error here", err.response.body);
      });
  };

  useEffect(() => {
    getQuestions(testPin);
  }, []);

  useEffect(() => {
    calculatePreviousScore();
  }, [individual]);

  const handleScoreChange = (questionIndex, score) => {
    setUpdatedScores((prevScores) => ({
      ...prevScores,
      [questionIndex]: score,
    }));
  };

  const updateDB = () => {
    Object.entries(updatedScores).forEach(([index, score]) => {
      individual[index] = Number(score);
    });
    axios
      .put("http://localhost:4000/api/test/updateScore", {
        pin: testPin,
        aadhaar: aadhaar,
        score: updatedScore * 100,
        indi: individual,
      }, options)
      .then((res) => {
        console.log("Successfully updated result");
        alert.show("Successfully updated result", { type: "success" });
        history.push("dashboard");
      })
      .catch((err) => {
        console.log(err.response.data);
      });
  };

  const calculatePreviousScore = () => {
    if (typeof individual === "object" && individual !== null) {
      const scores = Object.values(individual);
      const sum = scores.reduce((acc, score) => acc + score, 0);
      setPreviousScore(sum / scores.length);
    }
  };

  const calculateFinalScore = () => {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < Object.keys(individual).length; i++) {
      if (updatedScores[i] === undefined) {
        sum += individual[i];
      } else {
        sum += Number(updatedScores[i]);
      }
    }

    const totalScore = sum / Object.keys(individual).length;
    setUpdatedScore(totalScore);
    setShowResult(true);
  };

  const handleQuestionNavigation = (index) => {
    setActiveQuestion(index);
    const questionElement = document.getElementById(`question-${index}`);
    questionElement.scrollIntoView({ behavior: "smooth" });
  };

  const renderQuestion = (question, index) => {
    const questionId = `question-${index}`;
    if (question.type === "multiple") {
      const options = [...question.incorrect_answers, ...question.correct_answer];

      return (
        <div id={questionId} key={index}>
          <Card>
            <Card.Body>
              <Card.Title>Question {index + 1}</Card.Title>
              <Card.Text>{question.question}</Card.Text>
              <ListGroup>
                {options.map((option, optionIndex) => (
                  <ListGroup.Item
                    key={optionIndex}
                    style={{
                      backgroundColor:
                        answers &&
                        answers[index] === option &&
                        individual &&
                        individual[index] === 1
                          ? "rgba(144, 238, 144, 0.3)"
                          : answers &&
                            answers[index] === option &&
                            individual &&
                            individual[index] === 0
                          ? "rgba(255, 99, 71, 0.3)"
                          : "",
                    }}
                  >
                    <Form.Check
                      type="radio"
                      id={`option-${index}-${optionIndex}`}
                      label={option}
                      name={`question-${index}`}
                      value={option}
                      checked={answers && answers[index] === option}
                      disabled
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
      const currentScore = individual && individual[index];

      return (
        <div id={questionId} key={index}>
          <Card>
            <Card.Body>
              <Card.Title>Question {index + 1}</Card.Title>
              <Card.Text>{question.question}</Card.Text>
              <div>
                <strong>Response: </strong>
                {answers && answers[index]}
              </div>
              <div>
                <strong>Score: </strong>
                {currentScore}
              </div>
              <br />
              <Form.Control
                type="number"
                placeholder="Enter Score"
                value={updatedScores[index] || ""}
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
      <br />
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            {data.map((question, index) => renderQuestion(question, index))}
          </div>
          <div className="col-md-4 ">
            <div className="sticky-top ">
              <Card className="accordionsss">
              <Card.Body>
                <Card.Title>Navigate Questions</Card.Title>
                <Nav variant="pills" className="">
                  {data.map((question, index) => (
                    <Nav.Item key={index}>
                      <Nav.Link
                        active={index === activeQuestion}
                        onClick={() => handleQuestionNavigation(index)}
                      >
                        {index + 1}
                      </Nav.Link>
                    </Nav.Item>
                  ))}
                </Nav>
              </Card.Body>
                </Card>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Button onClick={calculateFinalScore}>Calculate Final Score</Button>
      {showResult && (
        <div className="text-center mt-5">
          <h3>Final Score:</h3>
          <div>Previous Score: {previousScore * 100}</div>
          <div>Updated Score: {updatedScore * 100}</div>
          <Button variant="primary"className="mt-3" onClick={() => updateDB()}>
            Update
          </Button>
        </div>
      )}
    </div>
  );
}

export default Grade;

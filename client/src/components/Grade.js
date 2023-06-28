import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, ListGroup } from "react-bootstrap";

function Grade({ location }) {
  const answers = location.state && location.state.student.result;
  const testPin = location.state && location.state.student.pin;
  const individual = location.state && location.state.student.individualScore;
  console.log("individual", individual.length);
  const [data, setData] = useState([]);
  const [scores, setScores] = useState({});
  const [updatedScores, setUpdatedScores] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [previousScore, setPreviousScore] = useState(0);
  const [updatedScore, setUpdatedScore] = useState(0);

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

  useEffect(() => {
    calculatePreviousScore();
  }, [individual]);

  const handleScoreChange = (questionIndex, score) => {
    setUpdatedScores((prevScores) => ({
      ...prevScores,
      [questionIndex]: score,
    }));
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
    console.log("updated scores", individual.length);
    for (let i = 0; i < Object.keys(individual).length; i++) {
      if (updatedScores[i] === undefined) {
        sum += individual[i];
      }
      else{
        sum += Number(updatedScores[i]);
      }
    }
   
    const totalScore = sum / Object.keys(individual).length;
    setUpdatedScore(totalScore);
    setShowResult(true);
  };
  
  const renderQuestion = (question, index) => {
    if (question.type === "multiple") {
      const options = [...question.incorrect_answers, ...question.correct_answer];

      return (
        <div key={index}>
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
        <div key={index}>
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
        {data.map((question, index) => renderQuestion(question, index))}
      </div>
      <br />
      <Button onClick={calculateFinalScore}>Calculate Final Score</Button>
      {showResult && (
        <div>
          <h3>Final Score:</h3>
          <div>Previous Score: {previousScore*100}</div>
          <div>Updated Score: {updatedScore*100}</div>
        </div>
      )}
    </div>
  );
}

export default Grade;

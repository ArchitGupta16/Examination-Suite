import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Alert, Button, Card, Form, Modal, ListGroup, Nav,Accordion } from "react-bootstrap";
import { useAlert } from "react-alert";
import "../componentsStyles/Grade.css"
import instance from "./AxiosInstance";

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
  const [showModal, setShowModal] = useState(false);
  const alert = useAlert();
  const history = useHistory();

  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const getQuestions = (testPin) => {
    instance
      .post("/api/test/getquestions", { pin: testPin }, options)
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
    instance
      .put("/api/test/updateScore", {
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
      setPreviousScore((sum / scores.length).toFixed(4));
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

    const totalScore = (sum / Object.keys(individual).length).toFixed(4);
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
          <Card border="secondary">
            <Card.Body>
              <Card.Title><strong>Question {index + 1}</strong></Card.Title>
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
          <Card border="secondary">
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

  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div>
      <hr className="my-4 hr-custom" />
      <div className="cc">
        <div className="row">
        <div className="col-md-4 ">
            <div className="sticky-top accordionsss">
              <Card border="secondary"  className="navi-box">
              <Card.Body>
                <div className="scrollable-navi">
                <Card.Title className="d-flex justify-content-center"><strong>Navigate Questions</strong></Card.Title>
                <hr className="my-4" />
                <Nav justify variant="pills" >
                  {data.map((_, index) => (
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
                </div>
              </Card.Body>
              </Card>
              <div className="d-flex justify-content-center">
                <Button style={{marginTop:"1vh",marginRight:"2vw"}} className="buttonss" onClick={() => {setShowModal(true);calculateFinalScore()}}>
                  Calculate Final Score
                </Button>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <br />
            {data.map((question, index) => renderQuestion(question, index))}
          </div>
        </div>
      </div>
      <br />
      
      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <i className="fa fa-arrow-up"></i>
        </div>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Final Changes</Modal.Title>
      </Modal.Header> 
      <Modal.Body>
        <Alert variant="secondary">
          <Alert.Heading>Previous Score: {previousScore * 100}</Alert.Heading>
          <Alert.Heading>Updated Score: {updatedScore * 100}</Alert.Heading>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="custom" className="mt-3 buttong" onClick={() => setShowModal(false)}>
          Close
        </Button>
        <Button variant="custom" className="mt-3 buttonss" onClick={() => updateDB()}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>

    </div>
  );
}

export default Grade;

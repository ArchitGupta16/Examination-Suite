import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, Form, Modal } from "react-bootstrap";
import "../componentsStyles/EditTest.css";
import axios from "axios";
import { useAlert } from "react-alert";

function EditTest() {
  let history = useHistory();
  let location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [modifiedQuestion, setModifiedQuestion] = useState(null);
  const [lastModifiedQuestion, setLastModifiedQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    correct_answer: [""],
    incorrect_answers: [""],
    category: "",
    type: "",
    image: "",
    difficulty: "",
  });
  const alert = useAlert();

  const getQuestions = () => {
    const { testdetails } = location.state;
    const pin = testdetails.pin;
    axios
      .post("http://localhost:4000/api/test/getquestions", { pin })
      .then((res) => {
        console.log(res, "got the questions");
        setQuestions(res.data.map((question) => ({ ...question, isModified: false })));
      })
      .catch((err) => {
        console.log("error here buddy", err.response.body);
      });
  };

  useEffect(() => {
    getQuestions();
  }, []);

  const handleQuestionChange = (questionId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((prevQuestion) =>
        prevQuestion._id === questionId
          ? { ...prevQuestion, question: value, isModified: true }
          : prevQuestion
      )
    );
    const modifiedQuestion = questions.find((question) => question._id === questionId);
    modifiedQuestion.question = value;
    modifiedQuestion.isModified = true;
    setModifiedQuestion(modifiedQuestion);
    setLastModifiedQuestion(modifiedQuestion);
  };

  const handleCorrectAnswerChange = (questionId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((prevQuestion) =>
        prevQuestion._id === questionId
          ? { ...prevQuestion, correct_answer: [value], isModified: true }
          : prevQuestion
      )
    );
    const modifiedQuestion = questions.find((question) => question._id === questionId);
    modifiedQuestion.correct_answer[0] = value;
    modifiedQuestion.isModified = true;
    setModifiedQuestion(modifiedQuestion);
    setLastModifiedQuestion(modifiedQuestion);
  };

  const handleIncorrectAnswerChange = (questionId, index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((prevQuestion) =>
        prevQuestion._id === questionId
          ? {
              ...prevQuestion,
              incorrect_answers: prevQuestion.incorrect_answers.map((answer, i) =>
                i === index ? value : answer
              ),
              isModified: true,
            }
          : prevQuestion
      )
    );
    const modifiedQuestion = questions.find((question) => question._id === questionId);
    modifiedQuestion.incorrect_answers[index] = value;
    modifiedQuestion.isModified = true;
    setModifiedQuestion(modifiedQuestion);
    setLastModifiedQuestion(modifiedQuestion);
  };

  const handleDeleteQuestion = (questionId) => {
    console.log(questionId);
    const datatoDelete = { id: questionId };
    axios
      .delete("http://localhost:4000/api/adminQuestion/deleteQuestion", { data: datatoDelete })
      .then((res) => {
        alert.show("Question Deleted", { type: "success" });
        getQuestions();
      })
      .catch((err) => {
        alert.show("Question not deleted", { type: "error" });
      });
  };

  const handleUpdateQuestion = (questionId) => {
    console.log("update question", modifiedQuestion);
    if (modifiedQuestion!==null){
    axios
      .put("http://localhost:4000/api/adminQuestion/updateQuestion", { modifiedQuestion })
      .then((res) => {
        alert.show("Question Updated", { type: "success" });
        getQuestions();
      })
      .catch((err) => {
        alert.show("Question not updated", { type: "error" });
      });
    }
    console.log(questionId, "hi");
  };

  const handleAddQuestion = () => {
    console.log("Add question:", newQuestion);
    setNewQuestion({
      question: "",
      correct_answer: [""],
      incorrect_answers: [""],
      type: "",
      image: "",
      difficulty: "",
    });
    setShowAddModal(false);
    axios
      .post("http://localhost:4000/api/adminQuestion/addQuestion", { newQuestion })
      .then((res) => {
        alert.show("Question Added", { type: "success" });
        getQuestions();
      })
      .catch((err) => {
        alert.show("Question not added! Something went wrong", { type: "error" });
      });
    
  };

  return (
    <div>
    <hr className="hr-custom" />
    <div className="d-flex justify-content-center mb-4">
      <Button className="add-button align-right"
          variant="primary" onClick={() => setShowAddModal(true)}>
        Add Question
      </Button>
      </div>
    <div className="centered-container">
      
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="new-question">
              <Form.Label>Question:</Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.question}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, question: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="new-correct-answers">
              <Form.Label>Correct Answers:</Form.Label>
              {newQuestion.correct_answer && newQuestion.correct_answer.map((answer, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(event) => {
                    const updatedAnswers = [...newQuestion.correct_answer];
                    updatedAnswers[index] = event.target.value;
                    setNewQuestion({ ...newQuestion, correct_answer: updatedAnswers });
                  }}
                />
              ))}
              <Button
                variant="dark"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    correct_answer: [...newQuestion.correct_answer, ""],
                  })
                }
                className="mt-2"
              >
                Add +
              </Button>
            </Form.Group>
            <Form.Group controlId="new-incorrect-answers">
              <Form.Label>Incorrect Answers:</Form.Label>
              {newQuestion.incorrect_answers.map((answer, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={answer}
                  onChange={(event) => {
                    const updatedAnswers = [...newQuestion.incorrect_answers];
                    updatedAnswers[index] = event.target.value;
                    setNewQuestion({ ...newQuestion, incorrect_answers: updatedAnswers });
                  }}
                />
              ))}
              <Button
                variant="dark"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    incorrect_answers: [...newQuestion.incorrect_answers, ""],
                  })
                }
                className="mt-2"
              >
                Add +
              </Button>
            </Form.Group>
            <Form.Group controlId="new-category">
              <Form.Label>Category:</Form.Label>
              <Form.Control
                type="number"
                value={newQuestion.category}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, category: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="new-type">
              <Form.Label>Type:</Form.Label>
              <Form.Control
                as="select"
                value={newQuestion.type}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, type: event.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="multiple">Multiple Choice</option>
                <option value="true/false">True/False</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="new-image">
              <Form.Label>Image:</Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.image}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, image: event.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="new-difficulty">
              <Form.Label>Difficulty:</Form.Label>
              <Form.Control
                as="select"
                value={newQuestion.difficulty}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, difficulty: event.target.value })
                }
              >
                <option value="">Select Difficulty</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="dark" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          
          <Button variant="success" onClick={handleAddQuestion} >
            Add Question
          </Button>
         
        </Modal.Footer>
      </Modal>
      
      <br/>

      {questions.map((question) => (
        <div className="mbb-3" key={question._id}>
          <Card>
            <Card.Body>
              <Card.Title>Question {question._id}</Card.Title>
              <Form>
                <Form.Group controlId={`question-${question._id}`}>
                  <Form.Label>Question:</Form.Label>
                  <Form.Control
                    type="text"
                    value={question.question}
                    onChange={(event) =>
                      handleQuestionChange(question._id, event.target.value)
                    }
                  />
                </Form.Group>
                {question.image && (
                  <Form.Group controlId={`image-${question._id}`}>
                    {/* <Form.Label>Image:</Form.Label> */}
                    <img
                      src={question.image}
                      alt={`Question ${question._id}`}
                      className="img-fluid"
                    />
                  </Form.Group>
                )}
                <Form.Group controlId={`correct-answer-${question._id}`}>
                  <Form.Label>Correct Answer:</Form.Label>
                  <Form.Control
                    type="text"
                    value={question.correct_answer[0]}
                    onChange={(event) =>
                      handleCorrectAnswerChange(question._id, event.target.value)
                    }
                  />
                </Form.Group>
                <Form.Group controlId={`incorrect-answers-${question._id}`}>
                  <Form.Label>Incorrect Answers:</Form.Label>
                  {question.incorrect_answers.map((incorrectAnswer, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      value={incorrectAnswer}
                      onChange={(event) =>
                        handleIncorrectAnswerChange(
                          question._id,
                          index,
                          event.target.value
                        )
                      }
                    />
                  ))}
                </Form.Group>
                <br/>
                <div className="d-grid gap-2">
                  <Button
                    variant="danger"
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="btn-auto-width"
                    style={{ width: "fit-content" }}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => handleUpdateQuestion(question._id)}
                    className="btn-auto-width"
                    style={{ width: "fit-content" }}
                  >
                    Update
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {lastModifiedQuestion && lastModifiedQuestion._id === question._id && (
            <Card>
              <Card.Body>
                <Card.Title>Last Modified Question:</Card.Title>
                <p>Question: {lastModifiedQuestion.question}</p>
                <p>Correct Answer: {lastModifiedQuestion.correct_answer[0]}</p>
                <p>
                  Incorrect Answers:{" "}
                  {lastModifiedQuestion.incorrect_answers.join(", ")}
                </p>
              </Card.Body>
            </Card>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}

export default EditTest;

import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, Card, Form, Modal,Nav,ListGroup,hr , Container} from "react-bootstrap";
import "../componentsStyles/EditTest.css";
import axios from "axios";
import { useAlert } from "react-alert";
import instance from "./AxiosInstance";

function EditTest() {
  let history = useHistory();
  let location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [modifiedQuestion, setModifiedQuestion] = useState(null);
  const [lastModifiedQuestion, setLastModifiedQuestion] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [data, setData] = useState(false);
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
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState(0);

  const getQuestions = () => {
    const { testdetails } = location.state;
    const pin = testdetails.pin;
    console.log(pin);
    instance
      .post("/api/test/getquestions", { pin })
      .then((res) => {
        setQuestions(res.data.map((question) => ({ ...question, isModified: false })));
        console.log(questions);
        
      })
      .catch((err) => {
        console.log("error here buddy", err.response.body);
        setData(true);
      });
  };

  useEffect(() => {
    getQuestions();
    console.log(questions)
  }, []);
  // useEffect(() => {
  //   console.log(questions);
  // }, [questions]);

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

  const handleCorrectAnswerChange = (questionId,index, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((prevQuestion) =>
        prevQuestion._id === questionId
          // ? { ...prevQuestion, correct_answer: [value], isModified: true }
          // : prevQuestion
          ? {
            ...prevQuestion,
            correct_answer: prevQuestion.correct_answer.map((answer, i) =>
              i === index ? value : answer
            ),
            isModified: true,
          }
        : prevQuestion
      )
    );
    const modifiedQuestion = questions.find((question) => question._id === questionId);
    modifiedQuestion.correct_answer[index] = value;
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
    instance
      .delete("/api/adminQuestion/deleteQuestion", { data: datatoDelete })
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
    instance
      .put("/api/adminQuestion/updateQuestion", { modifiedQuestion })
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
    instance
      .post("/api/adminQuestion/addQuestion", { newQuestion })
      .then((res) => {
        alert.show("Question Added", { type: "success" });
        getQuestions();
      })
      .catch((err) => {
        alert.show("Question not added! Something went wrong", { type: "error" });
      });
    
  };
  

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

  if (data) {
    return (
      <div>
        <hr className="hr-custom" />
        <Container className="mt-5">
          <h1 className="text-center">No Question Found</h1>
          <Button className="add-button align-right buttonss"
              variant="custom"  onClick={() => setShowAddModal(true)}>
            Add Question
          </Button>
          <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Add New Question</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="new-question">
              <Form.Label><strong>Question</strong></Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.question}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, question: event.target.value })
                }
                
              />
            </Form.Group><br/>
            <Form.Group controlId="new-correct-answers">
              <Form.Label><strong>Correct Answers</strong></Form.Label>
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
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    correct_answer: [...newQuestion.correct_answer, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
              
            </Form.Group>
            <br/>
            <Form.Group controlId="new-incorrect-answers">
              <Form.Label><strong>Incorrect Answers</strong></Form.Label>
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
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    incorrect_answers: [...newQuestion.incorrect_answers, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
            </Form.Group>
            <br/>
            <Form.Group controlId="new-category">
              <Form.Label><strong>Category</strong></Form.Label>
              <Form.Control
                type="number"
                value={newQuestion.category}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, category: event.target.value })
                }
              />
            </Form.Group><br/>
            <Form.Group controlId="new-type">
              <Form.Label><strong>Type</strong></Form.Label>
              <Form.Control
                as="select"
                value={newQuestion.type}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, type: event.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="multiple">Multiple</option>
                <option value="true/false">text</option>
              </Form.Control>
            </Form.Group><br/>
            <Form.Group controlId="new-image">
              <Form.Label><strong>Image link</strong></Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.image}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, image: event.target.value })
                }
              />
            </Form.Group><br/>
            <Form.Group controlId="new-difficulty">
              <Form.Label><strong>Difficulty</strong></Form.Label>
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
          <Button variant="custom" className="buttong" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          
          <Button variant="custom" className="buttong" onClick={handleAddQuestion} >
            Add Question
          </Button>
         
        </Modal.Footer>
        </Modal>
        </Container>
      </div>
    );
  }

  const handleQuestionNavigation = (question,index) => {
    setActiveQuestion(index);
    const questionElement = document.getElementById(question._id);
    questionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  

  return (
    <div>
    <hr className="hr-custom" />
    
    <div className="centered-container">

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title><strong>Add New Question</strong></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="new-question">
              <Form.Label><strong>Question</strong></Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.question}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, question: event.target.value })
                }
                
              />
            </Form.Group><br/>
            <Form.Group controlId="new-correct-answers">
              <Form.Label><strong>Correct Answers</strong></Form.Label>
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
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    correct_answer: [...newQuestion.correct_answer, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
              
            </Form.Group>
            <br/>
            <Form.Group controlId="new-incorrect-answers">
              <Form.Label><strong>Incorrect Answers</strong></Form.Label>
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
                variant="custom"
                onClick={() =>
                  setNewQuestion({
                    ...newQuestion,
                    incorrect_answers: [...newQuestion.incorrect_answers, ""],
                  })
                }
                className="mt-2 buttonss"
              >
                Add +
              </Button>
            </Form.Group>
            <br/>
            <Form.Group controlId="new-category">
              <Form.Label><strong>Category</strong></Form.Label>
              <Form.Control
                type="number"
                value={newQuestion.category}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, category: event.target.value })
                }
              />
            </Form.Group><br/>
            <Form.Group controlId="new-type">
              <Form.Label><strong>Type</strong></Form.Label>
              <Form.Control
                as="select"
                value={newQuestion.type}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, type: event.target.value })
                }
              >
                <option value="">Select Type</option>
                <option value="multiple">Multiple</option>
                <option value="true/false">text</option>
              </Form.Control>
            </Form.Group><br/>
            <Form.Group controlId="new-image">
              <Form.Label><strong>Image link</strong></Form.Label>
              <Form.Control
                type="text"
                value={newQuestion.image}
                onChange={(event) =>
                  setNewQuestion({ ...newQuestion, image: event.target.value })
                }
              />
            </Form.Group><br/>
            <Form.Group controlId="new-difficulty">
              <Form.Label><strong>Difficulty</strong></Form.Label>
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
          <Button variant="custom" className="buttong" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          
          <Button variant="custom" className="buttong" onClick={handleAddQuestion} >
            Add Question
          </Button>
         
        </Modal.Footer>
      </Modal>
      
      <div className="row">
        <div className="col-md-4 ">
        
        <div className="sticky-top accordionsss">
        <div className="d-flex justify-content-start mb-4 " >
          <Button className="add-button align-right buttonss"
              variant="custom"  onClick={() => setShowAddModal(true)}>
            Add Question
          </Button>
          </div>
        <Card border="secondary">
        <Card.Body>
          <div className="scrollable-navi ">
          <Card.Title className="d-flex justify-content-center"><strong>Navigate Questions</strong></Card.Title>
          <hr className="my-4" />
          <Nav justify variant="pills" >
            {questions.map((question, index) => (
              <Nav.Item key={index}>
                <Nav.Link
                  active={index === activeQuestion}
                  onClick={() => {
                    setActiveQuestion(index);
                    setTimeout(() => {
                      handleQuestionNavigation(question,index);
                    }, 0);
                  }}
                >
                  {index + 1}
                </Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          </div>
        </Card.Body>
          </Card>
      </div>
        </div>
        <div className="col-md-8">
        {questions.map((question,index) => (
        <div className="mbb-3" key={question._id} id={question._id}>
          <Card border="secondary">
            <Card.Body >
              <Card.Title><strong>Question {index+1}</strong></Card.Title>
              <Form >
                <Form.Group controlId={`question-${question._id}`}>
                  <Form.Label></Form.Label>
                  <Form.Control
                    type="text"
                    value={question.question}
                    onChange={(event) =>
                      handleQuestionChange(question._id, event.target.value)
                    }
                    className="mb-2 fieldd"
                  />
                </Form.Group>
                {question.image && (
                  <Form.Group controlId={`image-${question._id}`} className="d-flex justify-content-center align-items-center">
                    <img
                      src={question.image}
                      alt={`Question ${question._id}`}
                      className="img-fluid "
                    />
                  </Form.Group>
                )}
                <Form.Group controlId={`correct-answer-${question._id}`}>
                  <Form.Label><strong>Correct Answer</strong></Form.Label>
                  {question.correct_answer.map((correctAnswer, index) => (
                    <Form.Control
                      key={index}
                      type="text"
                      value={correctAnswer}
                      onChange={(event) =>
                        handleCorrectAnswerChange(
                          question._id,
                          index,
                          event.target.value
                        )
                      }
                      className="mb-2 fieldd"
                    />
                  ))}
                </Form.Group>
                <Form.Group controlId={`incorrect-answers-${question._id}`}>
                  <Form.Label><strong>Incorrect Answers</strong></Form.Label>
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
                      className="mb-2 fieldd"
                    />
                  ))}
                </Form.Group>
                <br/>
                  <Button
                    variant="custom"
                    onClick={() => handleDeleteQuestion(question._id)}
                    className="btn-auto-width buttonss"
                    style={{ width: "fit-content",marginRight:"10px", marginTop:"10px"}}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="custom"
                    onClick={() => handleUpdateQuestion(question._id)}
                    className="btn-auto-width buttong"
                    style={{ width: "fit-content",marginRight:"10px", marginTop:"10px" }}
                  >
                    Update
                  </Button>
              </Form>
            </Card.Body>
          </Card>

          {lastModifiedQuestion && lastModifiedQuestion._id === question._id && (
            <Card border="info" className="updatedCard">
            <Card.Body>
              <Card.Title>Last Modified Question:</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong>Question:</strong> {lastModifiedQuestion.question}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Correct Answer:</strong>{' '}
                  {lastModifiedQuestion.correct_answer.join(', ')}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Incorrect Answers:</strong>{' '}
                  {lastModifiedQuestion.incorrect_answers.join(', ')}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
          )}
        </div>
      ))}
      </div>
      </div>
      <br/>
      {showScrollToTop && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <i className="fa fa-arrow-up"></i>
        </div>
      )}
    </div>
    </div>
  );
}

export default EditTest;
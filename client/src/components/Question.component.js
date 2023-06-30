import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Card, Button, Form, FloatingLabel, ListGroup } from 'react-bootstrap';

function Question(props) {
  let history = useHistory();
  const alert = useAlert();
  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = res.time.split(":")[1] ? res.time.split(":")[1] : 0;
  const length = res.results.length;
  const [questype, settype] = useState(false);
  const [ques, setques] = useState(parseInt(localStorage.getItem("currentQuestionIndex")) || 0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState(JSON.parse(localStorage.getItem("answers")) || {});
  const [userAnswer, setUserAnswer] = useState(answers[ques] || "");
  const [image, setImage] = useState("");
  const [answered, setAnswered] = useState(false);
  const [allScore, setAllScore] = useState();

  const category = res.category;

  const submithandler = () => {
    
    let name = localStorage.getItem("name");
    let aadhaar = localStorage.getItem("aadhaar");
    let pin = localStorage.getItem("pin");
    let score = 0;
    let loc = {};
    if (category === "2" || category === "3" || category === "4") {
      for (let i = 0; i < length; i++) {
        loc[i] = 0;
        if (res.results[i].correct_answer.length > 1) {
          const temp = answers[i] ? answers[i].split(" ") : [];
          for (let j = 0; j < res.results[i].correct_answer.length; j++) {
            console.log(temp);
            if (temp.includes(res.results[i].correct_answer[j])) {
              score += 1 / res.results[i].correct_answer.length;
              loc[i] = 1 / res.results[i].correct_answer.length  
            }
          }
        } else {
          if (answers[i] == res.results[i].correct_answer) {
            score += 1;
          }
        }
      }
      setAllScore(loc)

    } else if (category === "5") {
      let loc= {}
      for (let i = 0; i < length; i++) {
        loc[i] = 0
        if (res.results[i].correct_answer.includes(answers[i])) {
          score += 1;
          loc[i] = 1
        }
      }
      setAllScore(loc)
    }
    score = (score / length) * 100;

    const options = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    axios
      .post(
        "http://localhost:4000/api/test/submittest",
        {
          pin,
          aadhaar,
          name,
          score,
          answers,
          loc,
        },
        options
      )
      .then((res) => {
        console.log(res);
        history.push("/");
        alert.show("Test Submitted Successfully", { type: "success" });
      })
      .catch((err) => console.log(err.response.data));
    localStorage.clear();
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  useEffect(() => {
    localStorage.setItem("currentQuestionIndex", ques);
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [ques, answers]);


  useEffect(() => {
    if (res.results[ques].type === "text") {
      settype(true);
    } else {
      settype(false);
    }
    console.log(questype);
    setquestion(res.results[ques].question);
    const shuffledOptions = shuffleArray([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]);
    setoptions(shuffledOptions);
    setUserAnswer(answers[ques] || "");
    setImage(res.results[ques]?.image || "");

  }, [ques]);


  useEffect(() => {
    setAnswered(answers[ques] !== undefined);
  }, [ques, answers]);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
    setanswers({ ...answers, [ques]: e.target.value });
    setAnswered(true);
  };

  const handleOptionClick = (option) => {
    setanswers({ ...answers, [ques]: option[0] });
    setAnswered(true);
  };


  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} submithandler={submithandler} />
      <Card className="mt-3">
        <Card.Title className="text-center mt-3 ">Question {ques + 1}</Card.Title>
        <Card.Text className="text-center">{question}</Card.Text>
      </Card>
      <div className="text-center mt-3">
        {image && <img src={image} alt="Question Image" />}
      </div>
      {!questype &&
        <div id="options" className="mt-3">
          <ListGroup>
            {options.map((option, index) => (
              <ListGroup.Item
                key={index}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer"
              >
                <Form.Check
                  type="radio"
                  id={index.toString()}
                  label={`${String.fromCharCode("A".charCodeAt(0) + index)}. ${option}`}
                  name="options"
                  value={option}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      }
      {questype &&
        <Form.Control
          type="text"
          placeholder="Enter your answer"
          value={userAnswer}
          onChange={handleAnswerChange}
          className="mt-3"
        />
      }
      <div className="d-flex justify-content-center mt-3">
        <a
          onClick={(e) => {
            if (ques == 0) {
            } else {
              setques(ques - 1);
            }
          }}
          className="me-3 cursor-pointer"
        >
          <Button variant="secondary">Previous</Button>
        </a>
        <a
          onClick={(e) => {
            if (ques === length - 1) {
              alert.show("This is the last question, Submitting the test.", { type: "warning" });
              submithandler();
            } else {
              setques(ques + 1);
            }
          }}
          disabled={!answered}
          className="cursor-pointer"
        >
          <Button variant="secondary">Next</Button>
        </a>
      </div>
    </Fragment>
  );
}

export default Question;

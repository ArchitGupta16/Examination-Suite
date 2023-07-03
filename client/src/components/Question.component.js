import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";
import { Card, Button, Form, ListGroup,ProgressBar} from 'react-bootstrap';

function Question(props) {
  let history = useHistory();
  const alert = useAlert();
  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = res.time.split(":")[1] ? res.time.split(":")[1] : 0;
  const length = res.results.length;
  let name = localStorage.getItem("name");
  let pin = localStorage.getItem("pin");
  const [questype, settype] = useState(false);
  const [ques, setques] = useState(parseInt(localStorage.getItem("currentQuestionIndex")) || 0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState(JSON.parse(localStorage.getItem("answers")) || {});
  const [userAnswer, setUserAnswer] = useState(answers[ques] || "");
  const [image, setImage] = useState("");
  const [answered, setAnswered] = useState(false);
  const [allScore, setAllScore] = useState();
  const [isLastQuestion, setIsLastQuestion] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

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
            loc[i] = 1
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
    setIsLastQuestion(ques === length - 1);
  }, [ques, answers, length]);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
    setanswers({ ...answers, [ques]: e.target.value });
    setAnswered(true);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setanswers({ ...answers, [ques]: option[0] });
    setAnswered(true);

  };

  const progress = ((ques + 1) / length) * 100;


  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} name={name} pin={pin}/>
      <div className="mt-4"> 
      <hr className="hr-custom" />
      </div>
      <div className={`container ${styles.questionContainer}`}>
        <ProgressBar now={progress} className={`mt-5 ${styles.progressBar}`} />
        <Card className={`mt-4 ${styles.questionCard}`}>
          <Card.Body className={styles.cardbody}>
            <Card.Title className={` ${styles.questionTitle} `}>
              Q{ques + 1}: {question}
            </Card.Title>
          </Card.Body>
        </Card>
        <div className={`text-center mt-3 `}>
              {image && (
                <img
                  src={image}
                  alt="Question"
                  className={styles.questionImage}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
            </div>
        {!questype && (
          <div id="options" className={`mt-4 ${styles.optionsContainer}`}>
            
              {options.map((option, index) => {
                const isChecked = option === answers[ques];
                
                return (
                  <Card
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className={`${styles.optionItem} cursor-pointer mb-1 ${option===selectedOption ? styles.selectedOption : ''}`}
                  >
                    <Card.Body>
                    <Card.Text className={styles.optionText}>
                      {`${String.fromCharCode("A".charCodeAt(0) + index)}. ${option}`}
                    </Card.Text>
                  </Card.Body>
                  </Card>
                );
              })}
            
          </div>
        )}
        {questype && (
          <Form.Control
            type="text"
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={handleAnswerChange}
            className={`mt-4 ${styles.answerInput}`}
          />
        )}
        <div className={`d-flex justify-content-center mt-4 ${styles.buttonContainer}`}>
          <Button
            variant="primary"
            onClick={(e) => {
              if (ques === 0) {
              } else {
                setques(ques - 1);
              }
            }}
            className={`me-3 ${styles.navigationButton}`}
          >
            Previous
          </Button>
           <Button
            variant={isLastQuestion ? "success" : "primary"}
            onClick={isLastQuestion ? submithandler : () => setques(ques + 1)}
            className={styles.navigationButton}
          >
            {isLastQuestion ? "Submit" : "Next"}
          </Button>
        </div>
      </div>
    </Fragment>
  );
}

export default Question;

import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Question(props) {
  let history = useHistory();

  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = (res.time.split(":")[1])? res.time.split(":")[1] : 0 ;
  const length = res.results.length;
  const [ques, setques] = useState(0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState({});
  const [userAnswer, setUserAnswer] = useState("");

  const submithandler = () => {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let pin = localStorage.getItem("pin");

    let score = 0;
    for (let i = 0; i < length; i++) {
      if (answers[i] == res.results[i].correct_answer) {
        score += 1;
      }
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
          email,
          name,
          score,
        },
        options
      )
      .then((res) => {
        console.log(res);
        history.push("/");
      })
      .catch((err) => console.log(err));
    console.log(score);
  };

  function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
      // Generate random number
      var j = Math.floor(Math.random() * (i + 1));

      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }

    return array;
  }

  useEffect(() => {
    for (let i = 0; i < length; i++) {
      res.results[i].question = res.results[i].question.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].correct_answer = res.results[i].correct_answer.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[ques].incorrect_answers = res.results[
        ques
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, []);

  useEffect(() => {
    setquestion(res.results[ques].question);
    setoptions([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]);
    shuffleArray(options);
    setUserAnswer("");
  }, [ques]);

  const entities = {
    "&#039;": "'",
    "&quot;": '"',
    "&lt;": "<",
    "&gt;": ">",
    "&#39;": "'",
    "&#34;": "'",
    "&#034;": '"',
    "&#60;": "<",
    "&#060;": "<",
    "&#62;": ">",
    "&#062;": ">",
    "&amp;": "&",
    "&#38;": "&",
    "&#038;": "&",
  };

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
    setanswers({ ...answers, [ques]: e.target.value });
  }

  const handleOptionClick = (e) => {
    let path = [];
    let node = e.target;
    while (node !== document) {
      path.push(node);
      node = node.parentNode;
    }
    path.push(document);

    console.log(path);

    path.reverse();
    let ans = "";
    for (let ele of path) {
      if (ele.id === "options") {
        for (let ans of ele.childNodes) {
          ans.className = styles.container;
        }
      } else if (ele.localName === "div" && ele.id === "") {
        ele.className = styles.containeractive;
        ans = ele.childNodes[0].value;
      }
    }
    setanswers({ ...answers, [ques]: ans });
 };

 const saveAnswer = () => {
  let name = localStorage.getItem("name");
  let email = localStorage.getItem("email");
  let pin = localStorage.getItem("pin");

  let score = 0;
  for (let i = 0; i < length; i++) {
    if (answers[i] == res.results[i].correct_answer) {
      score += 1;
    }
  }
  score = (score / length) * 100;
  const options = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  axios
    .post(
      "http://localhost:4000/api/test/saveanswer",
      {
        pin,
        email,
        name,
        question: res.results[ques].question,
        answer: userAnswer,
      },
      options
    )
    .then((res) => {
      console.log(res);
    })
    .catch((err) => console.log(err));
};

  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} submithandler={submithandler} />
      <div className={styles.qcontainer}>
        {ques + 1}. {question}
      </div>
      <div id="options">
        {options.map((option, index) => (
          <div key={index} className={styles.container} onClick={handleOptionClick}>
            <input
              className={styles.radios}
              type="radio"
              value={option}
              name="options"
              id={index.toString()}
            />
            <label htmlFor={index.toString()}>
              {String.fromCharCode("A".charCodeAt(0) + index)}. {option}
            </label>
          </div>
        ))}
        <div>
          <input
            type="text"
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={handleAnswerChange}
          />
          <button onClick={saveAnswer}>Save Answer</button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <a
          onClick={(e) => {
            if (ques == 0) {
            } else {
              setques(ques - 1);
              let answeropt = e.nativeEvent.path[2].childNodes[2].childNodes;
              for (let opt of answeropt) {
                opt.className = styles.container;
              }
            }
          }}
          className={styles.buttons1}
        >
          &#8249;
        </a>
        <a
          onClick={(e) => {
            if (ques === length - 1) {
              submithandler();
            } else {
              setques(ques + 1);
              let parentNode = e.target.parentNode.parentNode;
              let answeropt = parentNode.querySelector(".options")?.childNodes;
              if (answeropt) {
                for (let opt of answeropt) {
                  opt.className = styles.container;
                }
              }
            }
          }}
          className={styles.buttons2}
        >
          &#8250;
        </a>
      </div>
    </Fragment>
  );
}

export default Question;

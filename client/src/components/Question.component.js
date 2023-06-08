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
  const [questype, settype] = useState(false);
  const [ques, setques] = useState(0);
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState({});
  const [userAnswer, setUserAnswer] = useState("");
  const [image, setImage] = useState("");

  const submithandler = () => {
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let pin = localStorage.getItem("pin");

    let score = 0;
    for (let i = 0; i < length; i++) {
      
      if (res.results[i].correct_answer.length > 1) {
        const temp = answers[i] ? answers[i].split(" ") : []
        for (let j=0 ; j<res.results[i].correct_answer.length ; j++){ 
          console.log(temp)         
          if (temp.includes(res.results[i].correct_answer[j])) {
            score += 1/res.results[i].correct_answer.length;
          }
        }
      
    }
      else{
        if (answers[i] == res.results[i].correct_answer) {
          score += 1;
        }
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
      res.results[i].correct_answer = res.results[i].correct_answer.map((x) =>
      x.replace(/&#?\w+;/g, (match) => entities[match])
      );
      res.results[ques].incorrect_answers = res.results[
        ques
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, []);

  useEffect(() => {
    if (res.results[ques].type === "text"){
      settype(true);
    }
    else{
      settype(false);
    }
    console.log(questype)
    setquestion(res.results[ques].question);
    setoptions([
      res.results[ques].correct_answer,
      ...res.results[ques].incorrect_answers,
    ]);
    shuffleArray(options);
    setUserAnswer("");
    setImage(res.results[ques]?.image || "");
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

  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} submithandler={submithandler} />
      <div className={styles.qcontainer}>
        {ques + 1}. {question}
      </div>
      
      {!questype &&
      <div id="options" >
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
      </div>
      }
      {questype &&
        <div >
          <input
            type="text"
            placeholder="Enter your answer"
            value={userAnswer}
            onChange={handleAnswerChange}
            style={{
              display: "block",
              margin: "0 auto",
              width: "50%",
              height: "80px",
              fontSize: "20px",
              textAlign: "center",
              opacity: "0.6"
            }}
          />
          
        </div>
        }
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px"
        }}
      >
        <a
          onClick={(e) => {
            if (ques == 0) {
            } else {
              setques(ques - 1);
              let parentNode = e.target.parentNode.parentNode;
              let answeropt = parentNode.querySelector(".options")?.childNodes;
              if (answeropt) {
                for (let opt of answeropt) {
                  opt.className = styles.container;
                }
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
              alert("This is the last question");
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
        
        {image && (
          <img src={image} alt="Question Image" />
        )}
      </div>
    </Fragment>
  );
}

export default Question;

import React, { Fragment, useEffect, useState } from "react";
import styles from "../componentsStyles/Question.module.css";
import TestNav from "./TestNav.component";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

function Question(props) {
  let history = useHistory();
  const alert = useAlert();
  const res = props.location.state.res;
  const mins = res.time.split(":")[0];
  const secs = res.time.split(":")[1] ? res.time.split(":")[1] : 0;
  const length = res.results.length;
  const [questype, settype] = useState(false);
  const [ques, setques] = useState(
    parseInt(localStorage.getItem("currentQuestionIndex")) || 0
  );
  const [options, setoptions] = useState([]);
  const [question, setquestion] = useState("");
  const [answers, setanswers] = useState(
    JSON.parse(localStorage.getItem("answers")) || {}
  );
  const [userAnswer, setUserAnswer] = useState(
    answers[ques] || ""
  );
  const [image, setImage] = useState("");
  const [answered, setAnswered] = useState(false);
  const [allScore, setAllScore] = useState();
  const category = res.category;

  const submithandler = () => {
    // if (!answered) {
    //   alert.show("Please answer all the questions before submitting the test.", {
    //     type: "warning",
    //   });
    //   return;
    // }
    let name = localStorage.getItem("name");
    let email = localStorage.getItem("email");
    let pin = localStorage.getItem("pin");
    let score = 0;
    let loc = {}
    if (category === "2" || category === "3" || category === "4") {
      
      for (let i = 0; i < length; i++) {
        loc[i] = 0
        if (res.results[i].correct_answer.length > 1) {
          const temp = answers[i] ? answers[i].split(" ") : [];
          for (let j = 0; j < res.results[i].correct_answer.length; j++) {
            console.log(temp);
            if (temp.includes(res.results[i].correct_answer[j])) {
              score += 1 / res.results[i].correct_answer.length;
              loc[i] = 1            
            }
          }
        } else {
          if (answers[i] == res.results[i].correct_answer) {
            score += 1;
            loc[i] = 1   
          }
        }
        console.log(loc,"awdawdawdawd")
        
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
    console.log(allScore,"llslsl");
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
      localStorage.clear()
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
    for (let i = 0; i < length; i++) {
      res.results[i].question = res.results[i].question.replace(
        /&#?\w+;/g,
        (match) => entities[match]
      );
      res.results[i].correct_answer = res.results[i].correct_answer.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
      res.results[i].incorrect_answers = res.results[
        i
      ].incorrect_answers.map((x) =>
        x.replace(/&#?\w+;/g, (match) => entities[match])
      );
    }
  }, []);

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

  useEffect(() => {
    setAnswered(answers[ques] !== undefined);
  }, [ques, answers]);

  const handleAnswerChange = (e) => {
    setUserAnswer(e.target.value);
    setanswers({ ...answers, [ques]: e.target.value });
    setAnswered(true);
  };

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
    setAnswered(true);
  };


  return (
    <Fragment>
      <TestNav mins={mins} secs={secs} submithandler={submithandler} />
      <div className={styles.qcontainer}>
        {ques + 1}. {question}
      </div>
      <div>
        {image && (
          <img src={image} style={{alignContent:"center"}} alt="Question Image" />
        )}
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
            if (!answered) {
              alert.show("Please answer the current question before going to the next one.",{type:"warning"});
              return;
            }
            if (ques === length - 1) {
              alert.show("This is the last question, Submitting the test.", { type: "warning" });
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
          disabled={!answered}
        >
          &#8250;
        </a>


      </div>
    </Fragment>
  );
}

export default Question;

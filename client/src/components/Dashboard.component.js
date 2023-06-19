import React, { useState, useEffect, Fragment } from "react";
import Test from "./TestElement.component";
import styles from "../componentsStyles/Dashboard.module.css";
import axios from "axios";
import Modal from "react-modal";
import modalstyles from "../componentsStyles/Modal.module.css";
import teststyles from "../componentsStyles/Testelement.module.css";
import { useHistory } from "react-router-dom";
import resultstyles from "../componentsStyles/TestResult.module.css";
import { useAlert } from 'react-alert'
const topics = [
  { id: 1, name: "<--select category-->" },
  { id: 2, name: "EVS" },
  { id: 3, name: "Math" },
  { id: 4, name: "English" },
  { id: 5, name: "Computer" },
];

Modal.setAppElement("#root");
function Dashboard() {
  let history = useHistory();
  if (!localStorage.getItem("auth-token")) {
    localStorage.clear();
    history.push("/");
  }
  const [tests, setTests] = useState([]);
  const [modalIsOpen, setmodalIsOpen] = useState(false);
  const [topic, settopic] = useState("");
  const [amount, setamount] = useState("");
  const [time, settime] = useState("");
  const [expiry, setexpiry] = useState(new Date());
  const alert = useAlert()

  const options = {
    headers: {
      "Content-Type": "application/json",
      "auth-token": localStorage.getItem("auth-token"),
    },
  };

  useEffect(() => {
    axios
      .post("http://localhost:4000/api/test/gettests", {}, options)
      .then((res) => {
        for (let x of res.data) {
          for (let y of topics) {
            if (y["id"] == x["topic"]) x.topicname = y["name"];
          }
        }
        setTests(res.data);
      })
      .catch((err) => {
        if (!localStorage.getItem("auth-token")) history.push("/");
       else alert.show("couldn't fetch please reload",{type:"error"});
      });
  }, [modalIsOpen]);

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:4000/api/test/addtest",
        { topic, amount, time, expiry, created: new Date() },
        options
      )
      .then((res) => {
        console.log("added");

        setmodalIsOpen(false);
      })
      .catch((err) => {
        console.log(err);
        alert.show("Error : Test Not Added, Try again!", { type: "error" });
      });
  };

  return (
    <React.Fragment>
      <div>
        <h1
          className={styles.heading}
          style={{ background: "white", fontSize: "2em", padding: "2%" }}
        >
          Welcome {localStorage.getItem("name")}
        </h1>
      </div>
      <button
        className={styles.buttons}
        style={{ float: "left", display: "block" }}
        onClick={() => setmodalIsOpen(true)}
      >
        + Add Test
      </button>

      <br />
      <br />
      <br />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setmodalIsOpen(false)}
        className={modalstyles.modal}
        overlayClassName={modalstyles.overlay}
      >
        <Fragment>
          <h1 className={modalstyles.heading}>Create Test</h1>
          <form onSubmit={onSubmit}>
            <label className={modalstyles.labels} htmlFor="topic">
              Topic:
            </label>
            <select
              id="topic"
              name="topic"
              className={modalstyles.inputs}
              onChange={(e) => settopic(e.target.value.toString())}
            >
              {topics.map((obj) => (
                <option key={obj.id} value={obj.id}>
                  {obj.name}
                </option>
              ))}
            </select>
            <br />
            <label className={modalstyles.labels} htmlFor="amount">
              Number of Questions:
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              className={modalstyles.inputs}
              onChange={(e) => setamount(e.target.value)}
            />
            <br />
            <label className={modalstyles.labels} htmlFor="time">
              Time Duration (Mins):
            </label>
            <input
              type="text"
              id="time"
              name="time"
              className={modalstyles.inputs}
              onChange={(e) => settime(e.target.value)}
            />
            <br />
            <label className={modalstyles.labels} htmlFor="expiry">
              Expiry:
            </label>
            <input
              type="date"
              id="expiry"
              name="expiry"
              className={modalstyles.inputs}
              onChange={(e) => setexpiry(e.target.value)}
            />
            <br />
            <button className={modalstyles.buttons} type="submit">
              Submit
            </button>
            <br />
          </form>
        </Fragment>
      </Modal>
      <div className={teststyles.parent}>
        <div className={resultstyles.row}>
          <div className={teststyles.element}>
            <strong>Pin</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Topic</strong>
          </div>
          <div className={teststyles.element}>
            <strong>No. of Ques</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Time Duration (Mins)</strong>
          </div>
          <div className={teststyles.element}>
            <strong>Expiry</strong>
          </div>
        </div>
        <div className={styles.testcontainer}>
          {tests.map((obj) => (
            <Test key={obj._id} {...obj} />
          ))}
        </div>
      </div>
      <br />
      <br />
    </React.Fragment>
  );
}

export default Dashboard;

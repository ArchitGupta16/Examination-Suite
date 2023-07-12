import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsClockFill } from "react-icons/bs";
import { useHistory } from "react-router-dom";
import { useAlert } from "react-alert";

function Timer(props) {
  const [allsecs, setallsecs] = useState(() => {
    const storedSecs = localStorage.getItem("allsecs");
    if (storedSecs) {
      return parseInt(storedSecs);
    } else {
      return parseInt(props.mins) * 60 + parseInt(props.secs);
    }
  });
  const [mins, setmins] = useState(props.mins);
  const [secs, setsecs] = useState(props.secs);
  const alert = useAlert();
  const history = useHistory();

  const handle = () => {
    setallsecs((prev) => prev - 1);
  };

  useEffect(() => {
    const intervalId = setInterval(handle, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (allsecs === 0) {
      props.submithandler();
    } else {
      let altmins = Math.floor(allsecs / 60).toString();
      if (altmins.length === 1) altmins = "0" + altmins;
      let altsecs = (allsecs % 60).toString();
      if (altsecs.length === 1) altsecs = "0" + altsecs;
      setmins(altmins);
      setsecs(altsecs);
      localStorage.setItem("allsecs", allsecs.toString());
    }
  }, [allsecs, props.submithandler]);

  return (
    <div
      style={{
        justifyContent: "space-around",
        display: "flex",
        flexDirection: "row",
        width: "100%",
      }}
    >
      <BsClockFill size={40} style={{margin: "0 5px 0 0",color:"white" }} />
      <div
        style={{
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2em" }}>{mins}</h1>
      </div>
      <div
        style={{
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2em" }}>:</h1>
      </div>
      <div
        style={{
          color: "white",
          padding: "2% 2% 2% 2%",
          borderRadius: "8px",
        }}
      >
        <h1 style={{ fontSize: "2em" }}>{secs}</h1>
      </div>
    </div>
  );
}

export default Timer;
import React from "react";
import ReactDOM from "react-dom";
import App from "./App.js";
import { BrowserRouter } from "react-router-dom";
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const options = {
  position: positions.TOP_CENTER,
  timeout: 5000,
  offset: '30px',
  transition: transitions.FADE
}

const CustomAlertTemplate = ({ style, options, message, close }) => {
  let backgroundColor = "#28a745"; // Success
  let borderColor = "#1e7e34";
  let icon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );

  if (options.type === "error") {
    backgroundColor = "#dc3545"; // Error
    borderColor = "#c82333";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    );
  } else if (options.type === "warning") {
    backgroundColor = "#ffc107"; // Warning
    borderColor = "#ffb400";
    icon = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v10M12 17v.01" />
        <line x1="12" y1="12" x2="12" y2="16" />
      </svg>
    );
  }

  return (
    <div
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: backgroundColor,
        color: "#fff",
        borderRadius: "10px",
        padding: "20px",
        border: `1px solid ${borderColor}`,
        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {icon}
      <span style={{ marginLeft: "10px" }}>{message}</span>
    </div>
  );
};
ReactDOM.render(
  <BrowserRouter>
   <AlertProvider template={CustomAlertTemplate} {...options}>
    <App />
    </AlertProvider>
  </BrowserRouter>,
  
  document.getElementById("root")
);

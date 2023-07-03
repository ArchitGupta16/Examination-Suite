import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Timer from "./Timer";
import axios from "axios";
import styles from "../componentsStyles/TestNav.module.css";

function TestNav(props) {
  return (
    <Navbar className={`na ${styles.na}`} variant="light" expand="lg">
      <Container fluid>
        <div className={styles.navbarContent} >
        <Navbar.Brand className={` ${styles.testName}`}>
          Test -{props.pin}
        </Navbar.Brand>
            <div className={styles.timerBox} >
            <Timer {...props} />
            </div>
            <Navbar.Brand className={styles.name}>{props.name}</Navbar.Brand>
            </div>
      </Container>
    </Navbar>
    
  );
}

export default TestNav;

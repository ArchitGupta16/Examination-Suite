import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Timer from "./Timer";
import { BsPerson } from "react-icons/bs";
import axios from "axios";
import styles from "../componentsStyles/TestNav.module.css";

function TestNav(props) {
  return (
    <Navbar className={`na ${styles.na}`} >
      <Container fluid>
       
          
            <Navbar.Brand >
            <div className={`testname ${styles.testname}`}>
              Test -{props.pin}
              </div>
            </Navbar.Brand>
          
            
            <div className={`timerBox ${styles.timerBox}`} >
              <Timer {...props} />
            </div>

            
          
            <Navbar.Brand >
            <div className={`stuname ${styles.stuname}`}>
              
              <BsPerson className="mr-2" size={30} />
              {props.name}
              </div>
              </Navbar.Brand>
          
      
      </Container>
    </Navbar>
    
  );
}

export default TestNav;

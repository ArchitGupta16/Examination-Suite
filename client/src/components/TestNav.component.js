import React from "react";
import { Container, Navbar, Button } from "react-bootstrap";
import Timer from "./Timer.component";
import axios from "axios";

function TestNav(props) {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand>Test Name</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <div className="d-flex align-items-center">
            <Timer {...props} />
            <Button variant="primary" onClick={props.submithandler}>
              Submit
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TestNav;

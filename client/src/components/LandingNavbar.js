import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import  "../componentsStyles/LandingNavbar.css";


function CustomNavbar() {
  const history = useHistory();
  const handleCLick = () => {
    history.push("/taketest");
  }
  const loginClick = () => {
    history.push("/login");
  }
  return (
    
    <Navbar className="na sticky-top" expand="lg">
    <Container fluid>
      <Navbar.Brand href="/" >
        <img
          src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
          height="50"
          className="d-inline-block align-top imgg"
          alt="Brand Logo"
        />
      </Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text >
          <a href="/taketest" className="bgs">Take Test</a>
        </Navbar.Text>
        <Navbar.Text >
          <a href="/login" className="bgs">Login</a>
        </Navbar.Text>
      </Navbar.Collapse>
    </Container>
  </Navbar>

  
  );
}

export default CustomNavbar;
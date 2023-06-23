import React from 'react';
import { Navbar, Container, Button } from 'react-bootstrap';

function CustomNavbar() {
  return (
    <Navbar bg="light" variant="light">
      <Container>
        <Navbar.Brand href="#home">
          <img
            src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
            height="30"
            className="d-inline-block align-top"
            alt="Brand Logo"
          />
        </Navbar.Brand>
        <Button variant="primary">TAKE TEST</Button>{' '}
        <Button variant="primary">LOGIN</Button>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
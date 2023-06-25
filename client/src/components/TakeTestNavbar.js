import React from 'react';
import { Navbar, Container } from 'react-bootstrap';

function TakeTestNavbar() {
  return (
    <Navbar className="na sticky-top" expand="lg">
      <Container fluid>
        <Navbar.Brand href="/">
          <img
            src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
            height="50"
            className="d-inline-block align-top imgg"
            alt="Brand Logo"
          />
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
}

export default TakeTestNavbar;

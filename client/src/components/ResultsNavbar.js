import React from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function ResultsNavbar() {
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
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-end">
          <Nav>
            <Nav.Link as={Link} to="/dashboard">Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/logout">Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default ResultsNavbar;

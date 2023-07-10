import React from 'react';
import { Navbar, Container, Nav, Button,Row,Col } from 'react-bootstrap';
import { useHistory, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Login from './Login.js';
import "../componentsStyles/CustomNavbar.css";
import { Link } from 'react-router-dom';

function CustomNavbar(props) {
  const history = useHistory();
  const location = useLocation();
  const handleCLick = () => {
    history.push("/taketest");
  }

  const [showLogin, setShowLogin] = useState(false);
  const handleClose = () => setShowLogin(false);
  const handleShow = () => setShowLogin(true);

  
  const handleLogout = () => {
    localStorage.clear();
    props.setloggedin(false);
    history.push("/");
  }

  return (
    <Navbar className="na sticky-top " expand="lg"  >
      <Container fluid >
        
        
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav" className="justify-content-between">
          { location.pathname === "/" && (

            <>
              <Navbar.Brand  as={Link} to="/">
                <img
                  src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
                  height="50"
                  className="d-inline-block align-top imgg"
                  alt="Brand Logo"
                />
              </Navbar.Brand>
              { props.isLoggedIn ? (
                
                <Nav >
                 
                  <Nav.Link as={Link} to="/dashboard" >Dashboard</Nav.Link>
                  <Button variant="custom" className='custom-button' onClick={handleLogout} >Logout</Button>
                  
                </Nav>
              ) : (
                <Nav >
                    <Col>
                  <Button variant="custom" className='custom-button' as={Link} to="/taketest"style={{ width: '100px',marginTop:"5px",marginLeft:"10px" }} >Take Test</Button>
                  </Col>
                  <Col>
                  <Button variant="custom" className='custom-button' onClick={handleShow} style={{width:"100px", marginTop:"5px",marginLeft:"10px"}} >Login</Button>
                  </Col>
                  
                  <Login show={showLogin} handleClose={handleClose} setloggedin={props.setloggedin}  />
                </Nav>
              )}
            </>
          )}
          
          
          { location.pathname === "/dashboard" && (
            <>
              <Navbar.Brand  as={Link} to="/">
                <img
                  src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
                  height="50"
                  className="d-inline-block align-top imgg"
                  alt="Brand Logo"
                  
                />
              </Navbar.Brand> 
              <Nav>
              <Button variant="custom" className='custom-button' as={Link} to="/logout" style={{ width: '100px' }}>Logout</Button>
              
              </Nav>
            </>
          )}
          { location.pathname === "/test-results" && (
            <>
            <Navbar.Brand  as={Link} to="/">
                <img
                  src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
                  height="50"
                  className="d-inline-block align-top imgg"
                  alt="Brand Logo"
                  
                />
              </Navbar.Brand>
              <Nav>
              <Col>
              <Button variant="custom" className='custom-button' as={Link} to="/dashboard" style={{ marginTop:"5px" ,marginLeft:"10px"}}>Dashboard</Button>
              </Col>
              <Col>
              <Button variant="custom" className='custom-button' as={Link} to="/logout" style={{marginLeft:"10px",marginTop:"5px"}}>Logout</Button>
              </Col>
              </Nav>
            </>
          )}
          { location.pathname === "/grade" && (
            <>
            <Navbar.Brand  as={Link} to="/">
                <img
                  src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
                  height="50"
                  className="d-inline-block align-top imgg"
                  alt="Brand Logo"
                  
                />
              </Navbar.Brand> 
              <Nav>
              <Button variant="custom" className='custom-button'  as={Link} to="/logout" style={{ width: '100px' }} >Logout</Button>
              </Nav>
            </>
          )}
          { location.pathname === "/Edittest" && (
            <>
              <Navbar.Brand  as={Link} to="/">
                <img
                  src="https://i.ibb.co/wp6QBSZ/niitfoundatin-Logo.png"
                  height="50"
                  className="d-inline-block align-top imgg"
                  alt="Brand Logo"
                />
              </Navbar.Brand> 
              <Nav>
              <Button variant="custom" className='custom-button' as={Link} to="/logout" style={{ width: '100px' }}>Logout</Button>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
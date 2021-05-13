import {
  Col, Container, Nav, Navbar, Row,
} from 'react-bootstrap';
// import {UserContext} from "./UserContextProvider";
import { useContext } from 'react';
import Link from 'next/link';
import AppNavbar from './AppNavbar';

export default function Layout({ children }) {
  const { user, logOut, isUserLoggedIn } = useContext(UserContext);
  return (
    <div>
      <AppNavbar>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            {isUserLoggedIn ? (
              <a className="nav-link" role="button" onClick={() => logOut()}>Log out</a>
            ) : (
              <>
                <Link href="/login"><a className="nav-link" role="button">Log in</a></Link>
                <Link href="/register"><a className="nav-link" role="button">Register</a></Link>
              </>
            )}

          </Nav>
          <span className="navbar-text">
            {isUserLoggedIn ? `Hi, ${user.name}!` : 'You should log in'}
          </span>
        </Navbar.Collapse>
      </AppNavbar>
      <Container className="mt-5">
        <Row>
          <Col lg={{ offset: 1, span: 10 }}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

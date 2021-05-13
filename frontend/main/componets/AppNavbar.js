import { Container, Navbar } from 'react-bootstrap';
import Link from 'next/link';

export default function AppNavbar({ children }) {
  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container>
        <Link href="/"><Navbar.Brand>Auth Demo</Navbar.Brand></Link>
        {children}
      </Container>
    </Navbar>
  );
}

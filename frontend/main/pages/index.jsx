import React from 'react';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from 'react-bootstrap';
import { slice } from './_app';

export default function Index() {
  const { user, isUserLoggedIn, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  return (
    <>
      <Container>
        <Row>
          <Col>
            <Card>
              {loading ? 'loading' : (isUserLoggedIn ? `Name: ${user.name}` : 'No user') }
            </Card>
          </Col>
          <Col>
            <Button type="button" onClick={() => dispatch(slice.actions.loginState({ name: 'Test' }))}>login</Button>
            <Button type="button" onClick={() => dispatch(slice.actions.logOutState())}>logout</Button>
            <Button type="button" onClick={() => dispatch(slice.actions.loading())}>loading</Button>
          </Col>
        </Row>
      </Container>

    </>
  );
}

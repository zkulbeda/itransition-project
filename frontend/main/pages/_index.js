import {
  useEffect,
  useState,
} from 'react';
import CN from 'classnames';
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Row,
} from 'react-bootstrap';
import { DateTime } from 'luxon';
import { OrderedSet } from 'immutable';
import useSWR, { mutate } from 'swr';
import AccessForbiddenUntilLogInPage from '../componets/AccessForbiddenUntilLogInPage';
import Layout from '../componets/Layout';
import api from '../api';
import UsersTable from '../componets/UsersTable';
import CheckUserAbility from '../componets/CheckUserAbility';
import UnblockIcon from '../public/unlock.svg';
import BlockIcon from '../public/lock.svg';
import TrashIcon from '../public/trash.svg';

const UserStatus = {
  Blocked: 0,
  Active: 1,
};

function HomePageContent() {
  const {
    data: users,
    error: usersLoadingError,
    isValidating,
  } = useSWR('/users', (url) => api.get(url)
    .then((res) => res.data.users.map((e) => ({
      ...e,
      lastLogInDate: DateTime.fromISO(e.lastLogIn),
      regDate: DateTime.fromISO(e.regDate),
    }))));

  const [isQuerying, setQueryState] = useState(false);

  const [selectedUsers, setSelectedUsers] = useState(OrderedSet([]));
  useEffect(() => {
    if (!isValidating) {
      setSelectedUsers(selectedUsers.intersect(users.map((u) => u.ID)));
    }
  }, [users]);

  const checkHandler = (id, e) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.delete(id));
    } else {
      setSelectedUsers(selectedUsers.add(id));
    }
  };

  const checkAllHandler = (e) => {
    if (isAllChecked) {
      setSelectedUsers(selectedUsers.clear());
    } else {
      setSelectedUsers(selectedUsers.union(OrderedSet(users.map((e) => e.ID))));
    }
  };

  async function doQuery(action) {
    await api.post(`/users/${action}`, {
      IDs: selectedUsers.toArray(),
    });
  }

  const blockChecked = async () => {
    setQueryState(true);
    await doQuery('block');
    setQueryState(false);
    await mutate('/users');
  };
  const unblockChecked = async () => {
    setQueryState(true);
    await doQuery('unblock');
    setQueryState(false);
    await mutate('/users');
  };
  const deleteChecked = async () => {
    setQueryState(false);
    await doQuery('delete');
    setQueryState(false);
    setSelectedUsers(selectedUsers.clear());
    await mutate('/users');
  };

  const isAllChecked = users && (selectedUsers.size === users.length);
  const isAnyUserSelected = users && (selectedUsers.size > 0);

  return (
    <Layout>
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            <Col>
              {isQuerying ? 'Execute query...' : isValidating ? 'Updating data...' : (
                isAnyUserSelected
                  ? `${selectedUsers.size} user${selectedUsers.size > 1 ? 's are ' : ' is '}selected`
                  : 'Choose the user to operate'
              )}
            </Col>
            <Col className={CN('d-flex justify-content-end', {
              invisible: !isAnyUserSelected,
            })}
            >
              <ButtonGroup>
                <Button onClick={blockChecked} size="sm" variant="outline-primary" className="ml-1">
                  <BlockIcon viewBox="0 0 24 24" />
                  Block
                </Button>
                <Button onClick={unblockChecked} size="sm" variant="outline-primary">
                  <UnblockIcon
                    viewBox="0 0 24 24"
                  />
                </Button>
              </ButtonGroup>
              <Button onClick={deleteChecked} size="sm" variant="danger" className="ml-1">
                <TrashIcon
                  viewBox="0 0 24 24"
                />
              </Button>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {users
          && (
          <UsersTable
            isAllChecked={isAllChecked}
            selectedUsers={selectedUsers}
            users={users}
            onCheckAll={checkAllHandler}
            onCheckById={checkHandler}
          />
          )}
        </Card.Body>
      </Card>
    </Layout>
  );
}

export default function Home() {
  return (
    <CheckUserAbility to="read" subject="Users" fallback={<AccessForbiddenUntilLogInPage />}>
      <HomePageContent />
    </CheckUserAbility>
  );
}

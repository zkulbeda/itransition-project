import { FormCheck, Table } from 'react-bootstrap';
import { DateTime } from 'luxon';

export default function UsersTable({
  users, isAllChecked, onCheckAll, onCheckById, selectedUsers,
}) {
  return (
    <Table responsive striped bordered hover size="sm">
      <thead>
        <tr>
          <th>
            <FormCheck
              type="checkbox"
              checked={isAllChecked}
              onChange={onCheckAll}
              className="d-flex justify-content-center"
            />
          </th>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Date of register</th>
          <th>Date of last login</th>
          <th>State</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.ID}>
            <td>
              <FormCheck
                type="checkbox"
                checked={selectedUsers.includes(user.ID)}
                onChange={(e) => onCheckById(user.ID, e)}
                className="d-flex justify-content-center"
              />
            </td>
            <td>{user.ID}</td>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user.regDate.toLocaleString(DateTime.DATETIME_MED)}</td>
            <td>{user.lastLogInDate.toLocaleString(DateTime.DATETIME_MED)}</td>
            <td>{user.blocked ? 'Blocked' : 'Active'}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

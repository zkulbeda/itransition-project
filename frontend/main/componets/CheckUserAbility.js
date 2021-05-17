import { useContext } from 'react';
import { UserContext } from './UserContextProvider';

export default function CheckUserAbility({
  to, subject, object, children, fallback,
}) {
  const { user, userAbility } = useContext(UserContext);
  if (userAbility.can(to, subject, object)) return children;
  return fallback;
}

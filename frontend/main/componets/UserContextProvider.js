import {
  createContext,
  useEffect,
  useRef,
} from 'react';
import useSWR, { mutate } from 'swr';
import EventEmitter from 'eventemitter3';
import api from '../api';
import LoadingAppPage from './LoadingAppPage';

export const UserContext = createContext({});

const current_user_api_url = '/users/current';

export const UserContextProvider = (props) => {
  const { data: user, error } = useSWR(current_user_api_url, async (url) => api.get(url).then((res) => res.data.user));
  const updateUser = () => mutate(current_user_api_url);

  const { current: events } = useRef(new EventEmitter());
  useEffect(() => {
    function handler(error) {
      if (!error.response.data) return error;
      if (AutomaticLogOutError.is(error.response.data.error)) events.emit('auto-logout');
    }
    const id = api.interceptors.response.use(null, handler);
    return () => {
      api.interceptors.response.eject(id);
    };
  }, []);

  useEffect(() => {
    function handler() {
      updateUser();
    }
    events.addListener('auto-logout', handler);
    return () => {
      events.removeListener('auto-logout', handler);
    };
  }, []);

  const userAbility = getUserAbility(user);

  const isUserLoggedIn = user && user.ID !== undefined;

  const logOut = async () => {
    await api.post('/users/current/logout');
    await updateUser();
  };

  return (
    <UserContext.Provider value={{
      user, events, updateUser, error, logOut, userAbility, isUserLoggedIn,
    }}
    >
      {user === undefined ? <LoadingAppPage /> : props.children}
    </UserContext.Provider>
  );
};

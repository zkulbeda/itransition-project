import '../styles/globals.css';
import React from 'react';
// import {UserContextProvider} from "../componets/UserContextProvider";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  configureStore,
  createSlice,
} from '@reduxjs/toolkit';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

export const slice = createSlice({
  name: 'user',
  initialState: {
    loading: true,
    isUserLoggedIn: false,
    user: null,
  },
  reducers: {
    loginState: (state, { payload }) => {
      state.loading = false;
      if (!payload) state.isUserLoggedIn = false;
      state.isUserLoggedIn = true;
      state.user = payload;
    },
    logOutState: (state) => {
      state.isUserLoggedIn = false;
    },
    loading: (state) => {
      state.loading = true;
    },
  },
});
const store = configureStore({
  reducer: {
    user: slice.reducer,
  },
}, undefined, composeWithDevTools(applyMiddleware(thunkMiddleware)));

function MyApp({
  Component,
  pageProps,
}) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;

import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.scss';
import matchApp from './reducers';
import { successUserAuthentication, checkUserNotLogin } from './actions';
import { getUser } from './api';
import { objectKeysToCamelCase } from './utility/formattingData';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-config';

Amplify.configure(awsconfig);

const store = createStore(
  matchApp,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const loadUser = async () => {
  const result = await getUser();
  if (!result || !result.isAuthenticated) {
    store.dispatch(checkUserNotLogin());
  } else {
    store.dispatch(successUserAuthentication(objectKeysToCamelCase(result.user)));
  }
};

loadUser();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

import React, { useEffect, useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@material-ui/core';

import { HomePage, LoginPage } from './app/pages';
import { ProtectedRoute } from './app/components';

import { getConnectionState, getAdminData } from './app/redux/slices/admin';

function App() {
  const isConnected = useSelector(getConnectionState);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    dispatch(getAdminData()).then(() => setLoading(false));
  }, [dispatch]);

  return (
    <div className="App">
      {loading ?
        <div className="loading-data">
          <CircularProgress color="inherit" size={30} />
        </div> :
        <Switch>
          <ProtectedRoute
            path="/admin"
            component={HomePage}
          />
          <Route
            path="/login"
            component={LoginPage}
          />
          <Route
            path="/"
            render={() => {
              if (isConnected) {
                return (
                  <Redirect to="/admin" />
                );
              }

              return <Redirect to="/login" />
            }}
          />
        </Switch>
      }
    </div>
  );
}

export default App;

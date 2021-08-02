import React from 'react';
import PropTypes from 'prop-types';
import { Redirect, Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { getConnectionState } from '../redux/slices/admin';
const ProtectedRoute = (props) => {
    const { component: Component, path } = props;
    const isConnected = useSelector(getConnectionState);

    if (isConnected) {
        return (
            <Route path={path}>
                <Component />
            </Route>
        );
    }

    return (
        <Redirect to="/login" />
    );
};

ProtectedRoute.propTypes = {
    component: PropTypes.any,
    path: PropTypes.string
};

export default ProtectedRoute;

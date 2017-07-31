import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const Authenticated = ({ loggingIn, authenticated, component, roles, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      authenticated ?
      (React.createElement(component, { ...props, loggingIn, authenticated, roles })) :
      (<Redirect to="/logout" />)
    )}
  />
);

Authenticated.propTypes = {
  loggingIn: PropTypes.bool.isRequired,
  authenticated: PropTypes.bool.isRequired,
  component: PropTypes.func.isRequired,
  roles: PropTypes.array.isRequired,
};

export default Authenticated;

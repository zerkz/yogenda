import React from 'react';
import PropTypes from 'prop-types';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PublicNavigation from '../PublicNavigation/PublicNavigation';
import AuthenticatedNavigation from '../AuthenticatedNavigation/AuthenticatedNavigation';
import AdminNavigation from '../AdminNavigation/AdminNavigation';

import './Navigation.scss';



const Navigation = (props) => {

  let nav = <PublicNavigation />;
  if (props.authenticated) {
     nav = props ? <AdminNavigation {...props}/> : <AuthenticatedNavigation {...props} />;
  }
  return <Navbar>
    <Navbar.Header>
      <Navbar.Brand>
        <Link to="/">Yogenda</Link>
      </Navbar.Brand>
      <Navbar.Toggle />
    </Navbar.Header>
    <Navbar.Collapse>
      {nav}
    </Navbar.Collapse>
  </Navbar>;
};

Navigation.defaultProps = {
  name: '',
};

Navigation.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  roles : PropTypes.array.isRequired,
};

export default Navigation;

import React from 'react';
import Icon from '../../components/Icon/Icon';

import './Logout.scss';

const Logout = () => (
  <div className="Logout">
    <img
      src="/yoga_bear.jpg"
      alt="Clever Beagle"
    />
    <h1>Stay stretched out there.</h1>
    <p>{'Don\'t forget to like and follow Clever Beagle elsewhere on the web:'}</p>
    <ul className="FollowUsElsewhere">
      <li><a href="https://facebook.com/cleverbeagle"><Icon icon="facebook-official" /></a></li>
      <li><a href="https://twitter.com/clvrbgl"><Icon icon="twitter" /></a></li>
      <li><a href="https://github.com/cleverbeagle"><Icon icon="github" /></a></li>
    </ul>
  </div>
);

Logout.propTypes = {};

export default Logout;

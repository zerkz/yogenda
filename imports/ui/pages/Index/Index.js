import React from 'react';
import { Button } from 'react-bootstrap';

import './Index.scss';

const Index = () => (
  <div className="Index">
    <img
      src="/yoga_bear.jpg"
      alt="Clever Beagle"
    />
    <h1>Yogenda</h1>
    <p>Flexible Yoga Scheduling</p>
    <div>
      <Button bsStyle="success" href="http://cleverbeagle.com/pup">Read the docs.... yo.</Button>
    </div>
  </div>
);

export default Index;

import React from 'react';
import PropTypes from 'prop-types';
import YogaEventEditor from '../../components/YogaEventEditor/YogaEventEditor';

const NewYogaEvent = ({ history }) => (
  <div className="NewYogaEvent">
    <h4 className="page-header">New YogaEvent</h4>
    <YogaEventEditor history={history} />
  </div>
);

NewYogaEvent.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewYogaEvent;

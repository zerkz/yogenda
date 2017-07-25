import React from 'react';
import PropTypes from 'prop-types';
import YogaClassEditor from '../../components/YogaClassEditor/YogaClassEditor';


const NewYogaClass = ({ history }) => (
  <div className="NewYogaClass">
    <h4 className="page-header">New Yoga Class</h4>
    <YogaClassEditor history={history}/>
  </div>
);


NewYogaClass.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewYogaClass;

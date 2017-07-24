import React from 'react';
import PropTypes from 'prop-types';
import YogaEventEditor from '../../components/YogaEventEditor/YogaEventEditor';
// Choose your theme
import AutoForm from 'uniforms-bootstrap3/AutoForm';
// A compatible schema
import YogaEvents from '../../../api/YogaEvents/YogaEvents';

const NewYogaEvent = ({ history }) => (
  <div className="NewYogaEvent">
    <h4 className="page-header">New YogaEvent</h4>
    <AutoForm schema={YogaEvents.schema} onSubmit={doc => console.log(doc)}/>
  </div>
);

NewYogaEvent.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewYogaEvent;

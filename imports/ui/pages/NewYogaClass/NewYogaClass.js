import React from 'react';
import PropTypes from 'prop-types';
import YogaClassEditor from '../../components/YogaClassEditor/YogaClassEditor';

// Choose your theme
import AutoForm from 'uniforms-bootstrap3/AutoForm';

// A compatible schema
import YogaClasses from '../../../api/YogaClasses/YogaClasses';


const NewYogaClass = ({ history }) => (
  <div className="NewYogaClass">
    <h4 className="page-header">New YogaClass</h4>
    <AutoForm schema={YogaClasses.schema} onSubmit={doc => console.log(doc)}/>
  </div>
);

NewYogaClass.propTypes = {
  history: PropTypes.object.isRequired,
};

export default NewYogaClass;

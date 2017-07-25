/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, ControlLabel, Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import validate from '../../../modules/validate';
// Choose your theme
import AutoForm from 'uniforms-bootstrap3/AutoForm';
// A compatible schema
import YogaClasses from '../../../api/YogaClasses/YogaClasses';

class YogaClassEditor extends React.Component {

  handleSubmit(doc) {
    const { history } = this.props;
    const existingYogaClass = doc && doc._id;
    const methodToCall = existingYogaClass ? 'yogaClasses.update' : 'yogaClasses.insert';

    if (existingYogaClass) doc._id = existingYogaClass;

    Meteor.call(methodToCall, doc, (error, yogaClassId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingYogaClass ? 'YogaClass updated!' : 'YogaClass added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/yogaClasses/${yogaClassId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (<AutoForm schema={YogaClasses.schema} onSubmit={this.handleSubmit} model={doc} />);
  }
}

YogaClassEditor.defaultProps = {
  doc: { title: '', body: '' },
};

YogaClassEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default YogaClassEditor;

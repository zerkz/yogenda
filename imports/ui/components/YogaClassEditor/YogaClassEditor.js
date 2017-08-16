/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
// Choose your theme
//need this for material ui to work.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// Choose your theme
import AutoForm from 'uniforms-material/AutoForm';
// A compatible schema
import YogaClasses from '../../../api/YogaClasses/YogaClasses';

const YogaClassesUISchema = YogaClasses.simpleSchema().omit('_id','owner', 'createdAt', 'updatedAt');


class YogaClassEditor extends React.Component {


  handleSubmit(doc) {
    const { history } = this.props;
    const existingYogaClass = this.props.doc && this.props.doc._id;
    const methodToCall = existingYogaClass ? 'yogaClasses.update' : 'yogaClasses.insert';

    if (existingYogaClass) doc._id = existingYogaClass;

    Meteor.call(methodToCall, doc, (error, yogaClassId) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingYogaClass ? 'Yoga Class updated!' : 'Yoga Class added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/yogaClasses/${yogaClassId}`);
      }
    });
  }

  render() {
    const { doc } = this.props;
    return (
      <MuiThemeProvider>
        <AutoForm ref={ref => this.form = ref} 
        schema={YogaClassesUISchema} 
        onSubmit={this.handleSubmit.bind(this)} 
        model={doc} />
      </MuiThemeProvider>
    );
  }
}

YogaClassEditor.defaultProps = {
  doc: { "durationInMinutes" : 60, "maxAttendees" : 15},
};

YogaClassEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default YogaClassEditor;

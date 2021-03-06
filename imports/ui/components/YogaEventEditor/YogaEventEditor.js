/* eslint-disable max-len, no-return-assign */

import React from 'react';
import PropTypes from 'prop-types';
import { FormControl, FormGroup, Panel } from 'react-bootstrap';
import DateTime from 'react-datetime';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import _ from 'lodash'
//need this for material ui to work.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// Choose your theme
import AutoForm from 'uniforms-material/AutoForm';

// A compatible schema
import YogaEvents from '../../../api/YogaEvents/YogaEvents';
import moment from 'moment-timezone';


const eventOmitFields = 
  ['_id','owner', 'createdAt', 'updatedAt', 'attendees', 'waitlisted_attendees'];
const YogaEventsSchema = YogaEvents.simpleSchema().omit(...eventOmitFields);

class YogaEventEditor extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      model : this.props.doc
    };
    console.log(moment().toDate());
  }

  onYogaClassSelect() {
    let selIndex = this.yogaClassSelect.selectedIndex;
    if (selIndex > 0) {
      let selectedYogaClass = _.omit(this.props.yogaClasses[selIndex - 1], eventOmitFields);
      this.setState({
        model : selectedYogaClass
      });
    }
  }

  handleSubmit(doc) {
    const { history } = this.props;
    const existingYogaEvent = doc && doc._id;
    const methodToCall = existingYogaEvent ? 'yogaEvents.update' : 'yogaEvents.insert';

    if (existingYogaEvent) doc._id = existingYogaEvent;
    if (doc && !doc.startsAt) {
      //giant hack because default values for dates don't submit in uniforms?
      doc.startsAt = new Date();
    } 

    Meteor.call(methodToCall, doc, (error, yogaEventId) => {
      if (error) { 
        Bert.alert(error.reason, 'danger');
      } else {
        const confirmation = existingYogaEvent ? 'Yoga Event updated!' : 'Yoga Event added!';
        this.form.reset();
        Bert.alert(confirmation, 'success');
        history.push(`/yogaEvents/${yogaEventId}`);
      }
    });
  }

  render() {
    return (
      <MuiThemeProvider>
        <FormGroup>
          <Panel>
            <h4>Yoga Class Templates</h4>
            <FormControl componentClass='select' placeholder='No Templates Available' 
            onChange={this.onYogaClassSelect.bind(this)}
            inputRef={el => this.yogaClassSelect = el}>
            <option key='placeholder'>Choose a Yoga Class Template</option>
              {
                this.props.yogaClasses.map((yogaClass, i) => {
                  return <option key={i} >{yogaClass.title}</option>
                })
              }
            </FormControl>
          </Panel>
          <AutoForm ref={ref => this.form = ref} schema={YogaEventsSchema} onSubmit={this.handleSubmit.bind(this)} model={this.state.model} />     
        </FormGroup>
      </MuiThemeProvider>
    )
  }
}


YogaEventEditor.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
  yogaClasses: PropTypes.array.isRequired,
};

export default YogaEventEditor;

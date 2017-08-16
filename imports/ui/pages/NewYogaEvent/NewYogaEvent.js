import React from 'react';
import PropTypes from 'prop-types';
import YogaEventEditor from '../../components/YogaEventEditor/YogaEventEditor';
import YogaClasses from '../../../api/YogaClasses/YogaClasses';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';

// A compatible schema
import YogaEvents from '../../../api/YogaEvents/YogaEvents';

const NewYogaEvent = ({ history, loading, yogaClasses }) => (
  <div className="NewYogaEvent">
    <h4 className="page-header">New Yoga Event</h4>
    <YogaEventEditor history={history} yogaClasses={yogaClasses} />
  </div>
);

NewYogaEvent.propTypes = {
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  yogaClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('yogaClasses');
  return {
    loading: !subscription.ready(),
    yogaClasses: YogaClasses.find({owner : Meteor.userId()}).fetch() || [],
  };
}, NewYogaEvent);

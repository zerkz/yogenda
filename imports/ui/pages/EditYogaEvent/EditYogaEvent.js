import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import YogaEvents from '../../../api/YogaEvents/YogaEvents';
import YogaEventEditor from '../../components/YogaEventEditor/YogaEventEditor';
import NotFound from '../NotFound/NotFound';

const EditYogaEvent = ({ doc, history }) => (doc ? (
  <div className="EditYogaEvent">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <YogaEventEditor doc={doc} history={history} />
  </div>
) : <NotFound />);

EditYogaEvent.propTypes = {
  doc: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('yogaEvents.view', eventId);

  return {
    loading: !subscription.ready(),
    doc: YogaEvents.findOne(eventId),
  };
}, EditYogaEvent);

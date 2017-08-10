import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import YogaEvents from '../../../api/YogaEvents/YogaEvents';
import YogaClasses from '../../../api/YogaClasses/YogaClasses';
import YogaEventEditor from '../../components/YogaEventEditor/YogaEventEditor';
import NotFound from '../NotFound/NotFound';

const EditYogaEvent = ({ doc, history, yogaClasses }) => (doc ? (
  <div className="EditYogaEvent">
    <h4 className="page-header">{`Editing "${doc.title}"`}</h4>
    <YogaEventEditor doc={doc} history={history} yogaClasses={yogaClasses}/>
  </div>
) : <NotFound />);

EditYogaEvent.propTypes = {
  doc: PropTypes.object,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const eventSub = Meteor.subscribe('yogaEvents.view', eventId);
  const classesSub = Meteor.subscribe('yogaClasses');
  return {
    loading: !eventSub.ready() && !classesSub.ready() ,
    doc: YogaEvents.findOne(eventId),
    yogaClasses: YogaClasses.find({owner : Meteor.userId()}).fetch() || [],
  };
}, EditYogaEvent);

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button, 
  Grid, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import YogaEvents from '../../../api/YogaEvents/YogaEvents';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';
import moment from 'moment-timezone';
import _ from 'lodash';

const handleRemove = (eventId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('yogaEvents.remove', eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('YogaEvent deleted!', 'success');
        history.push('/yogaEvents');
      }
    });
  }
};

const signUp = (id) => {
  Meteor.call('yogaEvents.signUp', id, (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Sign up successful!', 'success');
      history.push('/yogaEvents');
    }
  });
};

const dropOff = (id) => {
  if (confirm('Are you sure you want to drop off?')) {
    Meteor.call('yogaEvents.dropOff', id, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('Dropped out of Yoga Event!', 'success');
        history.push('/yogaEvents');
      }
    });
  }
};

const renderYogaEvent = (doc, match, history, roles, ownerProfile) => (doc ? (
  <div className="ViewYogaEvent">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      {roles.includes['admin'] && 
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button bsStyle="success" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button bsStyle="success" onClick={() => handleRemove(doc._id, history)}>
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
      }
    </div>
    <Grid className="yoga-info-grid">
      <Row>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Instructor:</span>
          {ownerProfile.profile && ownerProfile.profile.name}
        </Col>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Date:</span>
          {moment.tz(doc.startsAt, moment.tz.guess())
            .format("dddd, MMMM Do YYYY, h:mm:ss a z")}
        </Col>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Duration (Minutes):</span>
          {doc.durationInMinutes}
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Max Attendees:</span>
          {doc.maxAttendees}
        </Col>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Location:</span>
          {doc.location}
        </Col>
        <Col xs={12} md={6} lg={4}>
          <span className='event-attr'>Additional Information:</span>
          {doc.additionalInformation}
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Spotify Playlist:</span>
          {doc.spotifyURL && 
            <a href={doc.spotifyURL}>{doc.spotifyURL}</a>}
        </Col>
      </Row>
      <Row>
         <Col xs={12} md={12} lg={12}>
            <h3>Yogis</h3>
         </Col>
      </Row>
      <Row>
         {doc.attendees.length > 0 ? 
            doc.attendees.map((attendee, i) => {
              return <Col key={i} xs={12} md={6} lg={4}>{attendee.name}</Col>
            })
          : <Col xs={12} md={12} lg={12} className="text-center"><h3>No Signups Yet!</h3></Col>}
      </Row>
      <Row>
         <Col xs={12} md={12} lg={12} className="text-center">
            { 
              //man this is dirty. needs refactor bad.
              doc.attendees.length >= doc.maxAttendees ? 
                <h3>No more spots left :(</h3> :
                  _.some(doc.attendees, { id : Meteor.userId() }) ? 
                  <Button bsStyle="danger" onClick={() => dropOff(doc._id)}>Drop Out</Button>
                  : <Button bsStyle="success" onClick={() => signUp(doc._id)}>Sign Up!</Button>  
            } 
         </Col>
      </Row>
    </Grid>
    
  </div>
) : <NotFound />);

const ViewYogaEvent = ({ loading, doc, match, history, roles, ownerProfile }) => (
  !loading ? renderYogaEvent(doc, match, history, roles, ownerProfile) : <Loading />
);

ViewYogaEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  roles: PropTypes.array.isRequired,
  ownerProfile : PropTypes.object.isRequired
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const eventSub = Meteor.subscribe('yogaEvents.view', eventId);
  const yogaEvent = YogaEvents.findOne(eventId);
  let eventOwnerSub;
  if (yogaEvent) {
    eventOwnerSub =  Meteor.subscribe('users.profile', yogaEvent.owner);
  }
  const ownerProfile = yogaEvent && Meteor.users.findOne(yogaEvent.owner);
  return {
    loading: !eventSub.ready() && (!yogaEvent || (!eventOwnerSub && !eventOwnerSub.ready())),
    doc: yogaEvent || {},
    ownerProfile : ownerProfile || {},
  };
}, ViewYogaEvent);

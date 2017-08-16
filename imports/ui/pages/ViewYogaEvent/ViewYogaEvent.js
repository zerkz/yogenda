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

const renderYogaEvent = (doc, match, history, roles, ownerProfile) => {
  //this sort is porbably not exactly required, 
  //but relying on insertion order is something im too lazy to process right now...
  const sortedYogis = _.orderBy(doc.attendees, 'dateAdded', 'asc');
  const maxAttendees = doc.maxAttendees;
  const attendees = sortedYogis.slice(0, maxAttendees);
  const waitList = sortedYogis.slice(maxAttendees, doc.attendees.length);
  return (doc ? (
  <div className="ViewYogaEvent">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <If condition={roles.includes('admin')} >
        <ButtonToolbar className="pull-right">
          <ButtonGroup bsSize="small">
            <Button bsStyle="warning" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
            <Button bsStyle="danger" onClick={() => handleRemove(doc._id, history)}>
              Delete
            </Button>
          </ButtonGroup>
        </ButtonToolbar>
      </If>
    </div>
    <Grid className="yoga-info-grid">
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Instructor:</span>
          {ownerProfile.profile && ownerProfile.profile.name}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Date:</span>
          {moment.tz(doc.startsAt, moment.tz.guess())
            .format("dddd, MMMM Do YYYY, h:mm:ss a z")}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Duration (Minutes):</span>
          {doc.durationInMinutes}
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Max Attendees:</span>
          {maxAttendees}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Location:</span>
          {doc.location}
        </Col>
        <Col xs={12} md={12} lg={12}>
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
      <br/>
      <Row>
         <Col xs={12} md={12} lg={12} className="text-center"> 
           <Choose>
            <When condition={_.some(doc.attendees, { id : Meteor.userId() })}>
              <Button bsStyle="danger" onClick={() => dropOff(doc._id)}>Drop Out</Button>
            </When>
            <When condition={attendees.length >= maxAttendees}>
              <Button bsStyle="success" onClick={() => signUp(doc._id)}>Waitlist Sign Up!</Button>
            </When>
            <Otherwise>
              <Button bsStyle="success" onClick={() => signUp(doc._id)}>Sign Up!</Button>
            </Otherwise>
           </Choose>
         </Col>
      </Row>
      <Row>
         <Col xs={12} md={12} lg={12}>
            <h3>Yogis:</h3>
         </Col>
      </Row>
      <Row>
        <Choose>
          <When condition={attendees.length > 0}> 
            {  
              attendees.map((attendee, i) => {
                return <Col key={i} xs={12} md={6} lg={4}>{attendee.name}</Col>
              })
            }
          </When>
          <Otherwise>
            <Col xs={12} md={12} lg={12} className="text-center"><h3>No Signups Yet!</h3></Col>
          </Otherwise>
        </Choose>
      </Row>
      <If condition={waitList.length > 0}>
        <Row>
         <Col xs={12} md={12} lg={12}>
            <h3>Waitlist:</h3>
         </Col>
        </Row>
        <Row>
            {  
              waitList.map((attendee, i) => {
                return <Col key={i} xs={12} md={6} lg={4}>{attendee.name}</Col>
              })
            }
        </Row>
      </If>
    </Grid>
  </div>
) : <NotFound />);
}

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

export default createContainer(({ match, roles }) => {
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
    roles : roles
  };
}, ViewYogaEvent);

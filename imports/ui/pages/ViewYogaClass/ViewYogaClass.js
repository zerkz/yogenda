import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button,
        Grid, Row, Col } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import YogaClasses from '../../../api/YogaClasses/YogaClasses';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

const handleRemove = (classId, history) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('yogaClasses.remove', classId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('YogaClass deleted!', 'success');
        history.push('/yogaClasses');
      }
    });
  }
};

const renderYogaClass = (doc, match, history) => (doc ? (
  <div className="ViewYogaClass">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button bsStyle="warning" onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button bsStyle="danger" onClick={() => handleRemove(doc._id, history)}>
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    <Grid className="yoga-info-grid">
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Description:</span>
          {doc.description}
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Max Attendees:</span>
          {doc.maxAttendees}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Location:</span>
          {doc.location}
        </Col>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Duration (Minutes):</span>
          {doc.durationInMinutes}
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={12} lg={12}>
          <span className='event-attr'>Spotify Playlist:</span>
          {doc.spotifyURL && 
            <a href={doc.spotifyURL}>{doc.spotifyURL}</a>}
        </Col>
      </Row>
    </Grid>
  </div>
) : <NotFound />);

const ViewYogaClass = ({ loading, doc, match, history }) => (
  !loading ? renderYogaClass(doc, match, history) : <Loading />
);

ViewYogaClass.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const classId = match.params._id;
  const subscription = Meteor.subscribe('yogaClasses.view', classId);

  return {
    loading: !subscription.ready(),
    doc: YogaClasses.findOne(classId) || {},
  };
}, ViewYogaClass);

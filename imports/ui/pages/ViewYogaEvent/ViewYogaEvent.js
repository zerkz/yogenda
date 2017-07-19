import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import YogaEvents from '../../../api/YogaEvents/YogaEvents';
import NotFound from '../NotFound/NotFound';
import Loading from '../../components/Loading/Loading';

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

const renderYogaEvent = (doc, match, history) => (doc ? (
  <div className="ViewYogaEvent">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ doc && doc.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(doc._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { doc && doc.body }
  </div>
) : <NotFound />);

const ViewYogaEvent = ({ loading, doc, match, history }) => (
  !loading ? renderYogaEvent(doc, match, history) : <Loading />
);

ViewYogaEvent.propTypes = {
  loading: PropTypes.bool.isRequired,
  doc: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const eventId = match.params._id;
  const subscription = Meteor.subscribe('yogaEvents.view', eventId);

  return {
    loading: !subscription.ready(),
    doc: YogaEvents.findOne(eventId) || {},
  };
}, ViewYogaEvent);

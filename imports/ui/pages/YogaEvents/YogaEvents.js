import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import YogaEventsCollection from '../../../api/YogaEvents/YogaEvents';
import Loading from '../../components/Loading/Loading';

import './YogaEvents.scss';

const handleRemove = (eventId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('yogaEvents.remove', eventId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('YogaEvent deleted!', 'success');
      }
    });
  }
};

const YogaEvents = ({ loading, yogaEvents, match, history }) => (!loading ? (
  <div className="YogaEvents">
    <div className="page-header clearfix">
      <h4 className="pull-left">Yoga Events</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add YogaEvent</Link>
    </div>
    {yogaEvents.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Last Updated</th>
          <th>Created</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {yogaEvents.map(({ _id, title, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            <td>
              <Button
                bsStyle="danger"
                onClick={() => handleRemove(_id)}
                block
              >Delete</Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No yogaEvents yet!</Alert>}
  </div>
) : <Loading />);

YogaEvents.propTypes = {
  loading: PropTypes.bool.isRequired,
  yogaEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('yogaEvents');
  return {
    loading: !subscription.ready(),
    yogaEvents: YogaEventsCollection.find().fetch(),
  };
}, YogaEvents);

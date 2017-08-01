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

const YogaEvents = ({ loading, yogaEvents, match, history, roles }) => (!loading ? (
  <div className="YogaEvents">
    { roles.includes('admin') && 
      <div className="page-header clearfix">
      <h4 className="pull-left">Yoga Events</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add YogaEvent</Link>
      </div>
    } 
    {yogaEvents.length ? <Table responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th />
          <th />
          <th>Last Updated</th>
          <th>Created</th>
        </tr>
      </thead>
      <tbody>
        {yogaEvents.map(({ _id, title, createdAt, updatedAt }) => (
          <tr key={_id}>
            <td>{title}</td>
            <td>
              <Button
                bsStyle="primary"
                onClick={() => history.push(`${match.url}/${_id}`)}
                block
              >View</Button>
            </td>
            {roles.includes('admin') && 
              <td>
              <Button
                bsStyle="danger"
                onClick={() => handleRemove(_id)}
                block>
                Delete</Button>
              </td>
            } 
            <td>{timeago(updatedAt)}</td>
            <td>{monthDayYearAtTime(createdAt)}</td>
            </tr>
        ))}
      </tbody>
    </Table> : <Alert bsStyle="warning">No Yoga Events yet!</Alert>}
  </div>
) : <Loading />);

YogaEvents.propTypes = {
  loading: PropTypes.bool.isRequired,
  yogaEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  roles : PropTypes.array.isRequired
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('yogaEvents');
  return {
    loading: !subscription.ready(),
    yogaEvents: YogaEventsCollection.find().fetch(),
  };
}, YogaEvents);

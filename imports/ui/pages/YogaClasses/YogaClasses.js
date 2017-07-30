import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Alert, Button } from 'react-bootstrap';
import { timeago, monthDayYearAtTime } from '@cleverbeagle/dates';
import { Meteor } from 'meteor/meteor';
import { createContainer } from 'meteor/react-meteor-data';
import { Bert } from 'meteor/themeteorchef:bert';
import YogaClassesCollection from '../../../api/YogaClasses/YogaClasses';
import Loading from '../../components/Loading/Loading';

import './YogaClasses.scss';

const handleRemove = (classId) => {
  if (confirm('Are you sure? This is permanent!')) {
    Meteor.call('yogaClasses.remove', classId, (error) => {
      if (error) {
        Bert.alert(error.reason, 'danger');
      } else {
        Bert.alert('YogaClass deleted!', 'success');
      }
    });
  }
};

const YogaClasses = ({ loading, YogaClasses, match, history }) => (!loading ? (
  <div className="YogaClasses">
    <div className="page-header clearfix">
      <h4 className="pull-left">Yoga Classes</h4>
      <Link className="btn btn-success pull-right" to={`${match.url}/new`}>Add YogaClass</Link>
    </div>
    {YogaClasses.length ? <Table responsive>
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
        {YogaClasses.map(({ _id, title, createdAt, updatedAt }) => (
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
    </Table> : <Alert bsStyle="warning">No YogaClasses yet!</Alert>}
  </div>
) : <Loading />);

YogaClasses.propTypes = {
  loading: PropTypes.bool.isRequired,
  YogaClasses: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(() => {
  const subscription = Meteor.subscribe('yogaClasses');
  return {
    loading: !subscription.ready(),
    YogaClasses: YogaClassesCollection.find({owner : Meteor.userId()}).fetch(),
  };
}, YogaClasses);

import React from 'react';
import PropTypes from 'prop-types';
import { ButtonToolbar, ButtonGroup, Button } from 'react-bootstrap';
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

const renderYogaClass = (yogaClass, match, history) => (yogaClass ? (
  <div className="ViewYogaClass">
    <div className="page-header clearfix">
      <h4 className="pull-left">{ yogaClass && yogaClass.title }</h4>
      <ButtonToolbar className="pull-right">
        <ButtonGroup bsSize="small">
          <Button onClick={() => history.push(`${match.url}/edit`)}>Edit</Button>
          <Button onClick={() => handleRemove(yogaClass._id, history)} className="text-danger">
            Delete
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </div>
    { yogaClass && yogaClass.body }
  </div>
) : <NotFound />);

const ViewYogaClass = ({ loading, yogaClass, match, history }) => (
  !loading ? renderYogaClass(yogaClass, match, history) : <Loading />
);

ViewYogaClass.propTypes = {
  loading: PropTypes.bool.isRequired,
  yogaClass: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const classId = match.params._id;
  const subscription = Meteor.subscribe('yogaClasses.view', classId);

  return {
    loading: !subscription.ready(),
    yogaClass: YogaClasses.findOne(classId) || {},
  };
}, ViewYogaClass);

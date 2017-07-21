import React from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import YogaClasses from '../../../api/YogaClasses/YogaClasses';
import YogaClassEditor from '../../components/YogaClassEditor/YogaClassEditor';
import NotFound from '../NotFound/NotFound';

const EditYogaClass = ({ yogaClass, history }) => (yogaClass ? (
  <div className="EditYogaClass">
    <h4 className="page-header">{`Editing "${yogaClass.title}"`}</h4>
    <YogaClassEditor doc={yogaClass} history={history} />
  </div>
) : <NotFound />);

EditYogaClass.propTypes = {
  doc: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default createContainer(({ match }) => {
  const classId = match.params._id;
  const subscription = Meteor.subscribe('yogaClass.view', classId);

  return {
    loading: !subscription.ready(),
    doc: YogaClasses.findOne(classId),
  };
}, EditYogaClass);

/**
* Enrolments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the enrolments
  */
  tableName: 'mdl_enrol',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    course: { model: 'course', columnName: 'courseid' }
  }

};

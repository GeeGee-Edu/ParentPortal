/**
* UserEnrolments.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the userEnrolments
  */
  tableName: 'mdl_user_enrolments',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    user:      { model: 'user', columnName: 'userid' },
    enrolment: { model: 'enrolment', columnName: 'enrolid' }
  }


};
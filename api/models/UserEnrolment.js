/**
 * UserEnrolments.js
 *
 * @description :: TODO: You might write a short summary
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
      autoIncrement: true
    },
    user: {
      model: 'user',
      columnName: 'userid'
    },
    enrolment: {
      model: 'enrolment',
      columnName: 'enrolid'
    }
  }
};

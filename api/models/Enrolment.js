/**
* Enrolments.js
*
* @description :: TODO:
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
      autoIncrement: true
    },
    course: { model: 'course', columnName: 'courseid' }
  },

};

/**
* Course.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the courses
  */
  tableName: 'mdl_course',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    fullname:  { type: 'string' },
    shortname: { type: 'string' }
  }

};

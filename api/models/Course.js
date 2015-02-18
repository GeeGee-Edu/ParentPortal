/**
* Course.js
*
* @description :: TODO: Short summary
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

    fullname:  {
      type: 'string'
    },

    shortname: {
      type: 'string'
    }
  }
};

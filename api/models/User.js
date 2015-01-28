/**
* Student.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the users
  */
  tableName: 'mdl_user',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    firstname: { type: 'string' },
    lastname: { type: 'string' },
    username: { type: 'string' },
    email: { type: 'email' }
  }

};

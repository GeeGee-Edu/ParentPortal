/**
* Attendance.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  schema: false,
  autoCreatedAt: true,
  autoUpdatedAt: true,
  connection: 'kitsongMongoServer',

  attributes: {
    user: { model: 'user' }
  }
};

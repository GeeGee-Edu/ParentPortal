/**
* Cohort.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
/*
  * Moodle table for the cohorts
  */
  tableName: 'mdl_cohort',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    name: { type: 'string' }
  }
};

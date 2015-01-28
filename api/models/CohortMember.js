/**
* CohortMember.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the cohort members
  */
  tableName: 'mdl_cohort_members',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },
    cohort: { model: 'cohort', columnName: 'cohortid' },
    user:   { model: 'user', columnName: 'userid' }
  }
};

/**
 * CohortMember.js
 *
 * @description :: TODO: You might write a short summary
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
      autoIncrement: true
    },
    cohort: {
      model: 'cohort',
      columnName: 'cohortid'
    },
    user: {
      model: 'user',
      columnName: 'userid'
    }
  }
};

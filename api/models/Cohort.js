/**
 * Cohort.js
 *
 * @description :: TODO: You might write a short summary
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
      autoIncrement: true
    },
    name: {
      type: 'string'
    }
  }
};

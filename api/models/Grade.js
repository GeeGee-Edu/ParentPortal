/**
 * Grades.js
 *
 * @description :: TODO:
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'mdl_grade_grades',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },

    user: {
      model: 'user',
      columnName: 'userid'
    },

    item: {
      model: 'gradeitem',
      columnName: 'itemid'
    },

    finalgrade: {
      type: 'integer'
    },

    rawgrademax: {
      type: 'int'
    },

    usermodified: {
      type: 'int'
    },

    aggregationweight:{
      type: 'int'
    },

    hidden: {
      type: 'int'
    },

    feedback: {
      type: 'string'
    }
  }

};

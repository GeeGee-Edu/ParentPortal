/**
 * GradeItem.js
 *
 * @description :: TODO
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'mdl_grade_items',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      autoIncrement: true
    },

    itemname: {
      type: 'string'
    },

    iteminfo: {
      type: 'string'
    },

    grademax: {
      type: 'integer'
    },

    hidden: {
      type: 'integer'
    },

    course: {
      model: 'course',
      columnName: 'courseid'
    }
  }
};

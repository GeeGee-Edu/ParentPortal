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
      required: true
    },

    itemname: {
      type: 'string'
    },

    iteminfo: {
      type: 'string'
    },

    course: {
      model: 'course',
      columnName: 'courseid'
    }
  }
};

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
      autoIncrement: true
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
      type: 'integer'
    },

    usermodified: {
      type: 'integer'
    },

    timemodified: {
      type: 'integer'
    },

    aggregationweight:{
      type: 'integer'
    },

    hidden: {
      type: 'integer'
    },

    feedback: {
      type: 'string'
    },

    date: function () {
      'use strict';

      var date = new Date(this.timemodified*1000);
      var dd = date.getDate();
      if(dd < 10){
        dd = '0' + dd;
      }
      var mm = (date.getMonth()+1);
      if(mm < 10){
        mm = '0' + mm;
      }
      return dd + '/' + mm;
    }
  }
};

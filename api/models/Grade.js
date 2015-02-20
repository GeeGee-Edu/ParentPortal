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
      type: 'int'
    },

    rawgrademax: {
      type: 'int'
    },

    usermodified: {
      type: 'int'
    },

    timemodified: {
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

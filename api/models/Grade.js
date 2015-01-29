/**
* Grades.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
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

    item: { model: 'gradeitem', columnName: 'itemid' },
    
    finalgrade: {
    	type: 'integer'
    },

    feedback: {
    	type: 'string'
    }
  }

};


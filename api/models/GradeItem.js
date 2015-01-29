/**
* GradeItem.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
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
    
    course: { model: 'course', columnName: 'courseid' }
  },

  /*
      Fetch the Course

      @param options => {id = course}
  */
  getCourse: function(gradeid, cb){
    GradeItem.findOne(gradeid).exec(function(err, item){
      if(err) return cb(400);

      Course.findOne(item.course).exec(function(err, course){
        if(err) return cb(400);

        return cb(null, course);
      });      
    });
  }


};


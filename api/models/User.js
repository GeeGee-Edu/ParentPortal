/**
* Student.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  /*
  * Moodle table for the users
  */
  tableName: 'mdl_user',

  attributes: {
    id: {
      type: 'integer',
      primaryKey: true,
      required: true
    },

    firstname: { 
      type: 'string' 
    },

    lastname: { 
      type: 'string' 
    },

    username: { 
      type: 'string' 
    },

    email: { 
      type: 'email' 
    },

    fullname: function(){
      return this.firstname + " " + this.lastname;
    }
  },

  /*
  *   Fetch the all Courses
  */
  getCourses: function(userid, cb){
    UserEnrolment.find({where  {user: userid} }).populate('enrolment').exec(function (err, enrols) {
      if(err) return cb(400);

      return cb(null, enrols);      
    });
  }

};

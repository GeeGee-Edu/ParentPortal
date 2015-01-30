/**
* AttendanceController
*
* @description :: Server-side logic for managing attendances
* @help        :: See http://links.sailsjs.org/docs/controllers
*/


module.exports = {

  /**
   * Attendance Homepage
   * @param  {[json]} req
   * @param  {[json]} res
   */
  index: function(req, res){
    'use strict';
    res.view('attendance.ejs');
  }

};

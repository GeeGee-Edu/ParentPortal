/**
 * ReportControllerController
 *
 * @description :: Server-side logic for managing Reportcontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	index: function(req, res){
		res.view("report.ejs");
	}
};


exports.createPDF = function(options, cb) {
  'use strict';

  var command = 'pdflatex -halt-on-error -output-directory=' +
    options.dir + ' ' + options.texfile;

  require('child_process').exec(command, function(err) {
      cb(err);
    });
};

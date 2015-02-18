exports.createPDF = function(options, cb) {
  'use strict';

  console.log('latex');
  require('child_process').exec('pdflatex -halt-on-error ' +
    options.filename + '.tex', function(err) {
      cb(err);
    });


};

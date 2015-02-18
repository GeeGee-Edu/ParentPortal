exports.createPDF = function(options, cb) {
  'use strict';

  console.log('latex');
  var fs = require('fs'),
    childProcess = require('child_process');

  fs.writeFile(options.filename + '.tex', options.tex, function(err) {
    if (err) {
      cb(err);
    }

    childProcess.spawn('pdflatex', [
      options.filename + '.tex'
    ]).on('exit',
      function(code) {
        cb(null, code);
      });
  });
};

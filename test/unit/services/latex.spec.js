var should = require('chai').should();
var fs = require('fs');
var latex = require('../../../api/services/latex');

before(function(done) {
  var tex = [
    '\\documentclass[11pt,a4paper,openright]{book}',
    '\\usepackage{graphicx}',
    '\\usepackage[table,xcdraw]{xcolor}',
    '\\usepackage{fancyhdr}',
    '\\usepackage{geometry}',
    '\\usepackage{caption}',
    '\\begin{document}',
    'This is a test document',
    '\\end{document}',
  ].join('\n');

  // Write the tex file
  fs.writeFile('test/.tmp/valid.tex', tex, function(err) {
    if (err) {
      console.log(err);
    }

    tex = [
      '\\docupaper,openright]{book}',
      'This is a test \do c _3 ument',
      '\\end{document}'
    ].join('\n');

    fs.writeFile('test/.tmp/invalid.tex', tex, function(err) {
      if (err) {
        console.log(err);
      }
      done();
    });
  });
  // Write the tex file

});


describe('PDFLatex Service', function(done) {

  describe('given a valid latex file', function() {

    it("should create a pdf", function(done) {

      latex.createPDF({
        texfile: 'test/.tmp/valid.tex',
        dir: 'test/.tmp'
      }, function(err) {
        should.not.exist(err);

        fs.open('test/.tmp/valid.pdf', 'r', function(err, file) {
          should.not.exist(err);
          done();
        });
      });
    });
  });

  describe('given an invalid latex file', function() {

    it("should give an error and not create a pdf", function(done) {

      latex.createPDF({
        texfile: 'test/.tmp/invalid.tex',
        dir: 'test/.tmp'
      }, function(err) {
        should.exist(err);

        fs.open('test/.tmp/invalid.pdf', 'r', function(err, file) {
          should.exist(err);
          done();
        });
      });
    });
  });
});

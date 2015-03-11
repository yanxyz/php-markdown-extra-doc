#!/usr/bin/env node

var fs = require('fs');
var md = require('markdown-it')({
  html: true,
  linkify: true,
  typography: true
}).use(require('markdown-it-toc'));

fs.readFile('doc.md', 'utf8', function(err, data) {
  if (err) throw err;
  var result = md.render(data);

  fs.readFile('tpl.html', 'utf8', function(err, data) {
    if (err) throw err;
    data = data.replace('[[content]]', result);
    fs.writeFile('index.html', data, 'utf8');
  });  
});
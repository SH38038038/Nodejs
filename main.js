const express = require('express')
const app = express()
var fs = require('fs');
var template = require('./lib/template.js');
var path = require('path');
var qs = require('querystring');
var sanitizeHtml = require('sanitize-html');
const port = 3000

//app.get`('/', (req, res) => res.send('Hello World!'))
app.get('/', function (req, res) {
  fs.readdir('./data', function (error, filelist) {
    var title = 'Welcome';
    var description = 'Hello, Node.js';
    var list = template.list(filelist);
    var html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    res.send(html);
  });
});

app.get('/page/:pageId', function (req, res) {
  fs.readdir('./data', function (error, filelist) {
    const filteredId = path.parse(req.params.pageId).base; // 대소문자 주의
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if (err) {
        return res.status(404).send('File not found');
      }
      const title = req.params.pageId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description, {
        allowedTags: ['h1']
      });
      const list = template.list(filelist);
      const html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update?id=${sanitizedTitle}">update</a>
          <form action="/delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html); // res.send 사용
    });
  });
});

app.get('/create', function (req, res) {
  fs.readdir('./data', function (error, filelist) {
    var title = 'WEB - create';
    var list = template.list(filelist);
    var html = template.HTML(title, list, `
      <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p>
          <textarea name="description" placeholder="description"></textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
    `, '');
    res.send(html);
  });
});

app.post('/create_process', function (req, res) {
  var body = '';
  req.on('data', function (data) {
    body = body + data;
  });
  req.on('end', function () {
    var post = qs.parse(body);
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
      res.writeHead(302, { Location: `/?id=${title}` });
      res.end();
    });
  });
});


app.get('/update/:pageId', function (req, res) {
  const pageId = req.params.pageId;  // params 사용
  const filteredId = path.parse(pageId).base; // 파일명 안전 처리

  fs.readdir('./data', function (err, filelist) {
    if (err) return res.status(500).send('Internal Server Error');

    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if (err) return res.status(404).send('File not found');

      const list = template.list(filelist);
      const html = template.HTML(pageId, list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${pageId}">
          <p><input type="text" name="title" placeholder="title" value="${pageId}"></p>
          <p><textarea name="description" placeholder="description">${description}</textarea></p>
          <p><input type="submit"></p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update/${pageId}">update</a>`
      );

      res.send(html); 
    });
  });
});

app.post('/update_process', function (req, res) {
  var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;
          fs.rename(`data/${id}`, `data/${title}`, function(error){
            fs.writeFile(`data/${title}`, description, 'utf8', function(err){
              res.writeHead(302, {Location: `/?id=${title}`});
              res.end();
            })
          });
      });
});

app.post('/delete_process', function (req, res) {
  var body = '';
      req.on('data', function(data){
          body = body + data;
      });
      req.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var filteredId = path.parse(id).base;
          fs.unlink(`data/${filteredId}`, function(error){
            /* res.writeHead(302, {Location: `/`});
            res.end(); */
            res.redirect('/'); // express의 res.redirect 사용 (위의 주석 처리된 부분과 동일한 기능 수행
          })
      });
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
});


/*
var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        fs.readdir('./data', function(error, filelist){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(filelist);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      } else {
        fs.readdir('./data', function(error, filelist){
          var filteredId = path.parse(queryData.id).base;
          fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
            var title = queryData.id;
            var sanitizedTitle = sanitizeHtml(title);
            var sanitizedDescription = sanitizeHtml(description, {
              allowedTags:['h1']
            });
            var list = template.list(filelist);
            var html = template.HTML(sanitizedTitle, list,
              `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${sanitizedTitle}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${sanitizedTitle}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
   
      
    } else if(pathname === '/delete_process'){
      
app.listen(3000);
*/


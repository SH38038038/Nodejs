## 0. 개발환경 세팅

[GitHub - web-n/Nodejs](https://github.com/web-n/Nodejs)

- 깃허브 레포지토리 포크 후 로컬에 클론하기
- 이후 vs-code 이용하여 편집하기

```bash
npm install -g pm2
npm install express
```

- 기존 express를 설치하지 않았기 때문에 설치하기
- 강의 pm2 사용하므로 설치하기

```bash
pm2 start main.js --name main --watch 
pm2 restart main
pm2 stop main
```

- `--name` main 옵션 사용하여 이름 지정
- `--watch` 옵션 사용하여 수정된 코드가 자동 반영되도록

## 1. Hello World

![image.png](attachment:45e81832-f7fc-4f6d-9dd8-acc08ca8f019:image.png)

```jsx
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

/*
app.get('/', function(req, res) {
	return res.send('Hello World!')
});

동일한 기능을 하는 코드이다. 
*/

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
 
```

## 2. 홈페이지 구현

```jsx
app.get('/', function(req, res) {
  fs.readdir('./data', function(error, filelist){
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

```

- Express가 제공하는 라우트 기능 사용
- 라우트 기능이란
    
    ```jsx
    const express = require('express');
    const app = express();
    
    // GET 요청
    app.get('/', (req, res) => {
      res.send('Hello GET');
    });
    
    // POST 요청
    app.post('/submit', (req, res) => {
      res.send('Hello POST');
    });
    
    // PUT 요청
    app.put('/user/:id', (req, res) => {
      res.send(`Update user ${req.params.id}`);
    });
    
    // DELETE 요청
    app.delete('/user/:id', (req, res) => {
      res.send(`Delete user ${req.params.id}`);
    });
    
    app.listen(3000);
    
    ```
    
    - `req.params` → URL 파라미터(`/user/:id`) 값 접근
    - `req.query` → 쿼리스트링(`/?id=1`) 값 접근
    - `req.body` → POST/PUT 요청의 바디(body) 데이터 접근 (body-parser 필요)
    - 규모가 커지면 라우트를 분리해서 관리한다.
    
    ```jsx
    # routes/user.js
    
    const express = require('express');
    const router = express.Router();
    
    router.get('/', (req, res) => {
      res.send('User list');
    });
    
    router.get('/:id', (req, res) => {
      res.send(`User detail for ${req.params.id}`);
    });
    
    module.exports = router;
    
    # app.js
    const express = require('express');
    const userRouter = require('./routes/user');
    const app = express();
    
    app.use('/users', userRouter); // /users 경로 아래 라우트 연결
    
    app.listen(3000);
    
    ```
    
    - Spring에서 `@RestController` + `@RequestMapping("/users")` 하는 거랑 비슷

## 3. 상세페이지 구현 (CRUD)

- Route parameters
    
    ## Route parameters
    
    Route parameters are named URL segments that are used to capture the values specified at their position in the URL. The captured values are populated in the `req.params` object, with the name of the route parameter specified in the path as their respective keys.
    
    ```jsx
    Route path: /users/:userId/books/:bookId
    Request URL: http://localhost:3000/users/34/books/8989
    req.params: { "userId": "34", "bookId": "8989" }
    ```
    
    To define routes with route parameters, simply specify the route parameters in the path of the route as shown below.
    
    ```jsx
    app.get('/users/:userId/books/:bookId', (req, res) => {
      res.send(req.params)
    })
    ```
    

```jsx
app.get('/page/:pageId', function(req, res) {
  fs.readdir('./data', function(error, filelist){
    const filteredId = path.parse(req.params.pageId).base;
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      if (err) {
        return res.status(404).send('File not found');
      }
      const title = req.params.pageId;
      const sanitizedTitle = sanitizeHtml(title);
      const sanitizedDescription = sanitizeHtml(description, {
        allowedTags:['h1']
      });
      const list = template.list(filelist);
      const html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
        ` <a href="/create">create</a>
          <a href="/update?id=${sanitizedTitle}">update</a>
          <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${sanitizedTitle}">
            <input type="submit" value="delete">
          </form>`
      );
      res.send(html); // res.send 사용
    });
  });
});
```

- `:pageId` → URL 경로 파라미터 → `./data` 폴더 안의 파일 목록 읽기

```jsx
app.get('/create', function(req, res) {
  fs.readdir('./data', function(error, filelist){
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

app.post('/create_process', function(req, res) {
  var body = '';  
  req.on('data', function(data){
      body = body + data;
  });
  req.on('end', function(){
      var post = qs.parse(body);
      var title = post.title;
      var description = post.description;
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.writeHead(302, {Location: `/?id=${title}`});
        res.end();
      });
  }); 
});
```

- **GET /create** → 사용자에게 글 작성 폼 제공
- **POST /create_process** → 폼 제출 데이터 받음
- 제목/내용 파일로 저장 → 성공하면 홈 또는 새 글 페이지로 이동
- 참고: Express에서는 `req.on('data')` 방식보다 `express.urlencoded({ extended: false })` **미들웨어**를 쓰면 더 간단하게 처리 가능하다
    
    **1. 문제점: `req.on('data')` 방식**
    
    ```jsx
    app.post('/create_process', function(req, res) {
      var body = '';
      req.on('data', function(data){ body += data; });
      req.on('end', function(){
        var post = qs.parse(body);
        console.log(post.title, post.description);
      });
    });
    ```
    
    - Node.js 원래 HTTP 서버 방식 그대로라서 **데이터를 스트림 단위로 수신**해야 함
    - POST 요청 데이터가 많으면 여러 번 나눠서 들어옴 → `data` 이벤트마다 합쳐야 함
    - 코드가 길어지고 반복적임
    
    **2. Express `express.urlencoded()` 미들웨어**
    
    ```jsx
    const express = require('express');
    const app = express();
    
    // application/x-www-form-urlencoded 파싱
    app.use(express.urlencoded({ extended: false }));
    
    ```
    
    - `express.urlencoded()`는 **폼 데이터 자동 파싱**
    - `extended: false` → 쿼리스트링 방식만 허용 (단순 객체)
    - 이제 `req.body`를 통해 바로 접근 가능
    
    **3. 적용 예시**
    
    ```jsx
    app.post('/create_process', function(req, res) {
      const title = req.body.title;
      const description = req.body.description;
    
      fs.writeFile(`data/${title}`, description, 'utf8', function(err){
        res.redirect(`/?id=${title}`);
      });
    });
    
    ```
    
    **장점**
    
    1. `req.on('data')` + `qs.parse` 필요 없음 → 코드 훨씬 짧음
    2. `req.body`로 바로 접근 가능 → 직관적
    3. 리다이렉트도 `res.redirect()`로 간단히 가능
    
    **4. 전체 흐름**
    
    1. `GET /create` → 폼 제공
    2. 사용자가 제출 → `POST /create_process`
    3. `express.urlencoded()`가 POST 데이터를 자동으로 파싱
    4. `req.body.title`, `req.body.description` 사용 → 파일 저장
    5. 저장 완료 → `res.redirect()`
- ⚠️error log : GET /update 구현 중 오류 발생
    
    ```jsx
    1|main  | Example app listening on port 3000
    1|main  | Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
    1|main  |     at ServerResponse.setHeader (node:_http_outgoing:699:11)
    1|main  |     at ServerResponse.header (C:\github\Nodejs\node_modules\express\lib\response.js:684:10)
    1|main  |     at ServerResponse.contentType (C:\github\Nodejs\node_modules\express\lib\response.js:514:15)
    1|main  |     at ServerResponse.send (C:\github\Nodejs\node_modules\express\lib\response.js:136:14)
    1|main  |     at C:\github\Nodejs\main.js:109:11
    1|main  |     at FSReqCallback.readFileAfterClose [as oncomplete] (node:internal/fs/read/context:68:3) {
    1|main  |   code: 'ERR_HTTP_HEADERS_SENT'
    1|main  | }
    PM2     | App [main:1] exited with code [1] via signal [SIGINT]
    PM2     | App [main:1] starting in -fork mode-
    PM2     | App [main:1] online
    1|main  | Example app listening on port 3000
    ```
    
    ```jsx
    # 기존코드
    
    app.get('/update/:pageId', function (req, res) { 
      fs.readdir('./data', function (error, filelist) { 
        var filteredId = path.parse(req.params.pageId).base; 
        fs.readFile(data/${filteredId}, 'utf8', function (err, description) { 
          if (err) { 
            return res.status(404).send('File not found'); // return 중요! 
          } 
          var title = req.params.pageId; 
          var list = template.list(filelist); 
          var html = template.HTML(
            title, 
            list, 
            `<form action="/update_process" method="post"> 
              <input type="hidden" name="id" value="${title}"> 
              <p><input type="text" name="title" placeholder="title" value="${title}"></p> 
              <p> 
                <textarea name="description" placeholder="description">${description}</textarea> 
              </p> 
              <p> 
                <input type="submit"> 
              </p> 
            </form>`, 
            `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          ); 
          res.send(html); 
        }); 
      }); 
    });
    
    ```
    
    - **쿼리와 params 혼용**
        - 기존 `/update` 코드는 URL 쿼리(`?id=CSS`)를 사용하지만, Express 버전에서는 `/update/:pageId`처럼 **params**를 사용하고 있음.
        - 혼용하면 `req.params.pageId` 또는 `queryData.id`가 `undefined`가 되어 `path.parse(undefined)` → `ERR_INVALID_ARG_TYPE` 발생.
    - **헤더 중복 전송**
        - `fs.readFile` 에러 처리 시 `res.status(404).send()` 후에도, 코드가 계속 실행되어 `res.send(html)`이 호출될 수 있음.
        - Express는 **응답 헤더를 한 번만 보낼 수 있음** → `ERR_HTTP_HEADERS_SENT` 발생.
    - **링크 URL 불일치**
        - 기존 form/action이나 update 링크가 `?id=CSS` 형태여서 `/update/:pageId`와 맞지 않음.
        - 이로 인해 Express가 올바른 route를 찾지 못하고 연결이 재설정됨 (`ERR_CONNECTION_RESET`).
    
    ```jsx
    # 수정 완료
    
    app.get('/update/:pageId', function (req, res) {
      fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(req.params.pageId).base;
        
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          if (err) {
            return res.status(404).send('File not found'); // return 중요!
          }
    
          var title = req.params.pageId;
          var list = template.list(filelist);
          var html = template.HTML(
            title,
            list,
            `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <p><input type="text" name="title" placeholder="title" value="${title}"></p>
              <p>
                <textarea name="description" placeholder="description">${description}</textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>
            `,
            `<a href="/create">create</a> <a href="/update/${title}">update</a>`
          );
    
          res.send(html);
        });
      });
    });
    
    ```
    

```jsx
app.get('/update/:pageId', function (req, res) {
  fs.readdir('./data', function (error, filelist) {
    var filteredId = path.parse(req.params.pageId).base;
    
    fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
      if (err) {
        return res.status(404).send('File not found'); // return 중요!
      }

      var title = req.params.pageId;
      var list = template.list(filelist);
      var html = template.HTML(
        title,
        list,
        `
        <form action="/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p><input type="text" name="title" placeholder="title" value="${title}"></p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
        `,
        `<a href="/create">create</a> <a href="/update/${title}">update</a>`
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
```

- GET /update시  `fs.readdir('./data')`  로 파일 목록 가져오고 URL 파라미터에서 파일명 받아 안전하게 처리
- POST /update_process시 `req.on('data')` 와 `req.on('end')` 로 body 수집 후 `qs.parse` 로 객체 형태로 반환

```jsx
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
            res.redirect('/'); // express의 res.redirect 사용 (위의 주석 처리된 부분과 동일한 기능 수행)
          })
      });
});

```

- HTML <form> 에서는 기본적으로 GET과 POST만 지원하기 때문에 DELETE 메서드 사용 불가
- 클라이언트가 POST로 삭제 요청 → 서버에서 파일 삭제 → 삭제 후 메인 페이지로 이동
- 안전하게 파일명을 필터링하고, Express의 `res.redirect`로 편리하게 리다이렉트 처리

**정리**

```json
[사용자] 
   |
   | GET /create
   v
[서버] → fs.readdir → template.HTML(입력 폼)
   |
   v
[브라우저] → 입력 폼 표시

---------------------------
[사용자] 
   |
   | POST /create_process
   v
[서버] → body 수신
       → fs.writeFile('data/title', description)
       → res.redirect('/?id=title')
   |
   v
[브라우저] → /?id=title 페이지 로딩

---------------------------
[사용자] 
   |
   | GET /page/:pageId
   v
[서버] → fs.readdir + fs.readFile('data/pageId')
       → template.HTML(내용 표시)
   |
   v
[브라우저] → 내용 표시

---------------------------
[사용자] 
   |
   | GET /update/:pageId
   v
[서버] → fs.readdir + fs.readFile('data/pageId')
       → template.HTML(수정 폼 표시)
   |
   v
[브라우저] → 수정 폼 표시

---------------------------
[사용자] 
   |
   | POST /update_process
   v
[서버] → body 수신
       → fs.rename('oldTitle', 'newTitle')
       → fs.writeFile('newTitle', description)
       → res.redirect('/?id=newTitle')
   |
   v
[브라우저] → /?id=newTitle 페이지 로딩

---------------------------
[사용자] 
   |
   | POST /delete_process
   v
[서버] → body 수신
       → fs.unlink('data/id')
       → res.redirect('/')
   |
   v
[브라우저] → / 페이지 로딩

```

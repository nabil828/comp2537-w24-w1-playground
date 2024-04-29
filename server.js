const express = require('express');
const app = express();
var session = require('express-session');
const { type } = require('os');

app.use(session({
  secret: 'the sky is blue!', // a bad secret
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

// TODO to replace it with a database
users = [
  {
    username: 'admin',
    password: 'admin',
    type: 'administrator'
  },
  {
    username: 'user1',
    password: 'pass1',
    type: 'non-administrator'
  },
  {
    username: 'user2',
    password: 'pass2',
    type: 'non-administrator'
  }
]

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.get('/route', (req, res) => {
  res.send('Hello Route');
});

app.get('/anotherRoute', (req, res) => {
  res.send('Hello Another Route');
});



app.get('/login', (req, res) => {
  res.send(`
  <form action="/login" method="post">
  <input type="text" name="username" />
  <input type="password" name="password" />
  <input type="submit" />
  </form>
  `);
})


app.use(express.urlencoded({ extended: true }));
app.post('/login', (req, res) => {
  if (users.find((user) => user.username == req.body.username && user.password == req.body.password)) {
    req.session.authenticated = true
    req.session.type = users.find((user) => user.username == req.body.username).type
    return res.redirect('/protectedRoute');
  }
  res.send('Access Denied');
})

app.get('/protectedRoute', (req, res) => {
  if (req.session.authenticated)
    res.send('Hello protected Route');
  else
    res.status(401).send('Please login first');
});

app.get('/anotherProtectedRoute', (req, res) => {
  if (req.session.authenticated)
    res.send('Hello protected Route');
  else
    res.status(401).send('Please login first');
});


app.get('/anotherProtectedRouteForAdminsOnly', (req, res) => {
  if (req.session.authenticated)
    if (req.session.type == 'administrator')       
      return res.send('anotherProtectedRouteForAdminsOnly');
    else 
      return res.status(401).send('Access Denied');
  res.status(401).send('Please login first');

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 
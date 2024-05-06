const express = require('express');
const app = express();
var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);
var store = new MongoDBStore({
  uri: 'mongodb://127.0.0.1:27017/connect_mongodb_session_test',
  collection: 'mySessions'
});

const ejs = require('ejs');

app.set('view engine', 'ejs');

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/test');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


const usersSchema = new mongoose.Schema({
  username: String,
  password: String,
  type: String
});


const userModel = mongoose.model('w1users', usersSchema);



app.use(session({
  secret: 'the sky is blue!', // a bad secret
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
  // TODO to replace the default memory session store with a database store
  store: store,
}))



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
app.post('/login', async (req, res) => {
  result = await userModel.findOne({
    username: req.body.username,
    password: req.body.password
  })

  if (result) {
    req.session.authenticated = true
    req.session.type = result.type
    req.session.username = result.username
    return res.redirect('/protectedRoute');
  }
  res.send('Access Denied');
})

isUserAuthenticated = (req, res, next) => {
  if (req.session.authenticated)
    next()
  else
    res.status(401).send('Please login first');
}
app.use(isUserAuthenticated) // this global middleware will be applied to all routes after this line

app.get('/protectedRoute', (req, res) => {
  res.render(`protectedRoute.ejs`,
    {
      username: req.session.username,
      type: req.session.type,
      todos: ['Buy Milk', 'Buy Eggs', 'Pay Bills']
    });
});

app.get('/anotherProtectedRoute', (req, res) => {
  res.render(`anotherProtectedRoute.ejs`, {
    username: req.session.username,
    type: req.session.type,
    todos: ['Buy Milk', 'Buy Eggs', 'Pay Bills']
  });
});
app.get('/anotherProtectedRoute2', (req, res) => {
  res.send('Hello another protected Route2');
});

isAdmin = (req, res, next) => {
  if (req.session.type == 'administrator')
    next()
  else
    return res.status(401).send('Access Denied');
}
app.use(isAdmin) // this global middleware will be applied to all routes after this line
app.get('/anotherProtectedRouteForAdminsOnly', (req, res) => {
  return res.send('anotherProtectedRouteForAdminsOnly');
});

app.get('/anotherProtectedRouteForAdminsOnly2', (req, res) => {
  return res.send('anotherProtectedRouteForAdminsOnly2');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 
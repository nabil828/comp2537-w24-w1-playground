const express = require('express');
const app = express();


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

authenticated = false
app.use(express.urlencoded({ extended: true }));
app.post('/login', (req, res) => {
  if (
    req.body.username === 'admin' &&
    req.body.password === 'admin') {
    authenticated = true
    return res.redirect('/protectedRoute');
  }
  res.send('Access Denied');
})

app.get('/protectedRoute', (req, res) => {
  if (authenticated)
    res.send('Hello protected Route');
  else
    res.status(401).send('Please login first');
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 
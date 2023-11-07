import express from 'express';
import path from 'path';
import { userRoute } from './routes/user.routes.js';
import { userState } from './db/auth.js';

const PORT = process.argv[2] || process.env.PORT || 3117;
const USER_ROUTE = '/api/v1/user';
const STATIC_DIR = './public';
const __dirname = path.resolve();

const app = express();

app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'pug');

// static assets
app.use(express.static(STATIC_DIR));
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.use(USER_ROUTE, userRoute);


app.get("/", function (req, res) {
  if (userState.authorized) {
    res.render("table", {});
  } else {
    res.redirect(302, '/login');
  }
});

app.get("/login", function (req, res) {
  if (userState.authorized) {
    res.redirect(302, '/');
  } else {
    res.render("login", {});
  }
});

app.post("/login", function (req, res) {
  // заглушка, как бы залогинились
  userState.authorized = true;

  if (userState.authorized) {
    res.redirect(302, '/');
  }
});

app.get("/logout", function (req, res) {
  // заглушка, как бы разлогинились
  userState.authorized = false;

  res.redirect(302, '/login');
});

app.get("/not-found", function (req, res) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});


// любой другой адрес, работает любой вариант
// app.use(function (req, res, next) {
app.get('/*', function (req, res, next) {
  res.redirect('/not-found');
});


app.listen(PORT, 'localhost', (err) => {
  err ? console.log(err) : console.log(`Server running at http://localhost:${PORT}/`);
});

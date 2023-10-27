import express from 'express';
import { userRoute } from './routes/user.routes.js';

const PORT = process.argv[2] || process.env.PORT || 3117;
const USER_ROUTE = '/api/user';
const STATIC_DIR = './public';

const app = express();


// static assets
app.use(express.static(STATIC_DIR));
// parse form data
app.use(express.urlencoded({ extended: false }));
// parse json
app.use(express.json());

app.use(USER_ROUTE, userRoute);


app.listen(PORT, 'localhost', (err) => {
  err ? console.log(err) : console.log(`Server running at http://localhost:${PORT}/`);
});

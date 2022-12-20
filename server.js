const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const mongoose = require('mongoose');
const apiRoutes = require('./routes/api');
const fccTestingRoutes = require('./routes/fcctesting');
const runner = require('./test-runner');

const app = express();

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(cors({ origin: '*' })); // USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// connect to mongodb via mongoose
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log('Connected to mongo');
} catch {
  console.log('Error: Could not connect to mongo');
}

// define new schema
const bookSchema = new mongoose.Schema({
  comments: [],
  title: { type: String, required: true },
  commentcount: { type: Number, default: 0 },
});

// create new model
const book = mongoose.model('issue', bookSchema);

// Index page (static HTML)
app.route('/')
  .get((req, res) => {
    res.sendFile(`${process.cwd()}/views/index.html`);
  });

// For FCC testing purposes
fccTestingRoutes(app);

// Routing for API
apiRoutes(app, book);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404)
    .type('text')
    .send('Not Found');
});

// Start our server and tests!
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
  if (process.env.NODE_ENV === 'test') {
    console.log('Running Tests...');
    setTimeout(() => {
      try {
        runner.run();
      } catch (e) {
        console.log('Tests are not valid:');
        console.error(e);
      }
    }, 1500);
  }
});

module.exports = app; // for unit/functional testing

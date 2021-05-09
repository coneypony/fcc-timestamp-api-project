// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api", (req, res, next) => {
  // Return current time if no arguments given
  let date = new Date();
  
  // Create formatted return object
  const formatted = {
    unix: date.valueOf(), 
    utc: date.toUTCString()
  };
  
  res.json(formatted); 
  next();
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// My API endpoint
app.get('/api/:date', (req, res, next) => {
  console.log(req.params.date);
  // TODO Needs to attempt to parse any valid date.
  let anyDate = new Date(req.params.date);
  console.log(anyDate)
  // Test for valid date before continuing.
  if (!isNaN(anyDate)) {
    const formatted = {
      unix: anyDate.valueOf(), 
      utc: anyDate.toUTCString()
    };
    res.json(formatted); 
    next();
  } else {
    console.log(req.params.date + " got this far")
    // Regex check for Unix Epoch date
    let unixTimeCheck = /[0-9]{1,4294967296}/;
    let unixDate = unixTimeCheck.exec(req.params.date);
    // Regex to check for YYYYMMDD
    let ymdTimeCheck = /([0-9]{4})-([012][0-9])-([0-9]{2})/
    let ymdDate = ymdTimeCheck.exec(req.params.date)

    let date; // Initialize
    if (unixDate && !ymdDate) {
      date = new Date(Number.parseInt(unixDate, 10));
      // Test for valid date before continuing.
      if (isNaN(date)) {
          res.json({ error: "Invalid Date" });
          next();
      }
    } else if (ymdDate) {
      date = new Date(ymdDate[0]);
      // Test for valid date before continuing.
      if (isNaN(date)) {
        res.json({ error: "Invalid Date" });
        next();
      }
    } else {
      res.json({ error: "Invalid Date" });
      next();
    }

    // Create formatted return object
    if (date) {
    const formatted = {
      unix: date.valueOf(), 
      utc: date.toUTCString()
    };
    
    res.json(formatted); 
    next();
    }
  }
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
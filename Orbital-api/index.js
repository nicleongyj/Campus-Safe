const express = require('express');
const incidentHandler = require('./VerifiedIncidentNotification.js');
const infraHandler = require('./VerifiedInfraNotification.js');
//import handler from './VerifiedIncidentNotification.js'

const app = express();

app.listen(5000, () => {
  console.log("Running on port 5000.");
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.post('/VerifiedIncidentNotification', (req, res) => {
    incidentHandler(req, res);
})

app.post('/VerifiedInfraNotification', (req, res) => {
    infraHandler(req, res);
})

module.exports = app ;
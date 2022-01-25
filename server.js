const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cors = require('cors');
const port = process.env.PORT || 3004;
const app = express();
app.use(bodyParser.json());
app.use(cors({origin: '*'}));
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));
app.get('/*', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(path.join(__dirname, 'build', 'index.html')); //serving build folder
});
app.listen(port, function () {
    console.log('%s listening at %s',port);
});
require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
  },
});
const cors = require('cors');
const RegController = require('../controllers/RegController');
const WebSocketController = require('../controllers/WebSocketController');
const StartServer = require('../controllers/StartServer');

StartServer(server);

io.use(WebSocketController.middleWare);
io.on('connection', WebSocketController.connection);

app.use(express.static(path.resolve(__dirname, 'client')));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.post('/api', RegController);

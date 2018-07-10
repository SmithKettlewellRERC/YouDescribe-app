const express = require('express');
const path = require('path');
const http = require('http');
const cluster = require('cluster');
const numWorkers = require('os').cpus().length;

const port = 3000;
const app = express();

// Legacy URLs handler.
const legacyUrlsController = require('./controllers/legacyUrlsController');

app.get(`/player.php`, (req, res) => {
  legacyUrlsController.redirect(req, res);
});

// Tha main folder.
app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

// The drain.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

// app.listen(port, () => {
//   console.log(`Server is listening on port ${port}...`);
// });

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe  ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running.`);
  console.log(`Master cluster setting up ${numWorkers} workers...`);

  for (let i = 0; i < numWorkers; i += 1) {
    cluster.fork();
  }

  cluster.on('online', (worker) => {
    console.log(`Worker (child process) ${worker.process.pid} is running.`);
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died with code: ${code}, and signal: ${signal}.`);
    console.log('Starting a new worker.');
    cluster.fork();
  });
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(port, () => {
    console.log(`Child process ${process.pid} is listening to all incoming requests on port ${port}.`);
  });
  httpServer.on('error', onError);
}

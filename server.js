"use strict";

const express = require("express"),
    WebSocket = require("ws"),
    http = require("http"),
    path = require("path"),
    os = require('os'),
    SERVER_PORT = 3000,
    DIST_DIR = __dirname,
    HTML_FILE = path.join(DIST_DIR, "index.html");

const app = express();
const server = http.createServer(app);
const websocketServer = new WebSocket.Server({ server });

app.use(express.static(DIST_DIR));

websocketServer.on("connection", (wsc) => {
    wsc.send("Websocket Connected!");
    setInterval(
        () => {
            // in the land of multi-cpu computers the avg needs to be normalized by number of CPUs 
            const cpus = os.cpus().length;
            const avg = os.loadavg()[0]/cpus 
            wsc.send(`{
                time: ${Date.now()},
                value: ${avg}
            }`);
        },
        10000
    );
});

app.get("/", (_req, res) => res.sendFile(HTML_FILE));

server.listen(SERVER_PORT, () =>
    console.log(`Server connected on port ${SERVER_PORT}`)
);
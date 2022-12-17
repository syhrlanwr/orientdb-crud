const express = require('express');
const app = express();
const port = 3000;
const OrientDB = require('orientjs');

const server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'root'
});

const db = server.use({
    name: 'cobain',
    username: 'admin',
    password: 'admin'
});

console.log('Using database:', db.name);
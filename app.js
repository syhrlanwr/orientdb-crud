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

db.exec('CREATE CLASS Book IF NOT EXISTS EXTENDS V');

db.exec('CREATE PROPERTY Book.id IF NOT EXISTS INTEGER (MANDATORY TRUE)');
db.exec('CREATE PROPERTY Book.title IF NOT EXISTS STRING');
db.exec('CREATE PROPERTY Book.author IF NOT EXISTS STRING');
db.exec('CREATE PROPERTY Book.year IF NOT EXISTS STRING');

app.set('view engine', 'ejs');


app.get('/',async (req, res) => {
    const sql = 'SELECT FROM Book';
    const result = await db.query(sql);
    res.render('index', { books: result });
});



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

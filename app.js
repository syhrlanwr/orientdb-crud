const express = require('express');
const app = express();
const port = 3000;
const OrientDB = require('orientjs');

const server = OrientDB({
  host: 'localhost',
  port: 2424,
  username: 'root',
  password: 'root',
});

const db = server.use({
  name: 'cobain',
  username: 'admin',
  password: 'admin',
});

db.exec('CREATE CLASS Book IF NOT EXISTS EXTENDS V');

db.exec('CREATE PROPERTY Book.id IF NOT EXISTS INTEGER (MANDATORY TRUE)');
db.exec('CREATE PROPERTY Book.title IF NOT EXISTS STRING');
db.exec('CREATE PROPERTY Book.author IF NOT EXISTS STRING');
db.exec('CREATE PROPERTY Book.year IF NOT EXISTS STRING');

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const sql = 'SELECT FROM Book';
  const result = await db.query(sql);
  res.render('index', { books: result });
});

app.get('/add', (req, res) => {
  res.render('add-book');
});

app.post('/add', async (req, res) => {
  const { title, author, year } = req.body;
  const sql = 'INSERT INTO Book (id, title, author, year) VALUES (:id, :title, :author, :year)';
  const idquery = 'SELECT MAX(id) FROM Book';
  const id = await db.query(idquery).then((result) => {
    if (result[0]['MAX'] == null) {
      return 1;
    }
    return result[0]['MAX'] + 1;
  });
  const result = await db.query(sql, { params: { id, title, author, year } });
  res.redirect('/');
});

app.get('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT FROM Book WHERE id = :id';
  const result = await db.query(sql, { params: { id } });
  res.render('edit-book', { book: result[0] });
});

app.post('/edit/:id', async (req, res) => {
  const { id } = req.params;
  const { title, author, year } = req.body;
  const sql = 'UPDATE Book SET title = :title, author = :author, year = :year WHERE id = :id';
  const result = await db.query(sql, { params: { id, title, author, year } });
  res.redirect('/');
});

app.get('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE VERTEX FROM Book WHERE id = :id';
  const result = await db.query(sql, { params: { id } });
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

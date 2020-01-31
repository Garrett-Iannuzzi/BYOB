const express = require('express');
const app = express();
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';

app.get('/api/v1/metros', async (request, response) => {
  try {
    const metros = await database('metros').select();
    response.status(200).json(metros)
  } catch(error) {
    console.error(error)
    response.status(500).json("Internal Server Error")
  }
});

app.get('/api/v1/titles', async (request, response) => {
  try {
    const titles = await database('titles').select();
    response.status(200).json(titles)
  } catch(error) {
    response.status(500).json("Internal Server Error")
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


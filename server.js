const express = require('express');
const app = express();

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(express.json());


app.set('port', process.env.PORT || 3000);
app.locals.title = 'BYOB';

app.get('/api/v1/metros', async (request, response) => {
  try {
    const metros = await database('metros').select();
    return response.status(200).json(metros)
  } catch(error) {
    return response.status(500).json('Internal Server Error')
  }
});

app.get('/api/v1/titles', async (request, response) => {
  try {
    const titles = await database('titles').select();
    return response.status(200).json(titles)
  } catch(error) {
    return response.status(500).json('Internal Server Error')
  }
});

app.get('/api/v1/metros/:id', async (request, response) => {
  const { id } = request.params

  if(!parseInt(id)) {
    return response.status(422).json({ error: 'Incorrect ID:' + id })
  }
  try {
    const metro  = await database('metros').where('id', id).select();
    if(!metro.length) {
      return response.status(404).json({ error: 'Could not find metro with ID:' + id })
    }
    return response.status(200).json({metro: metro[0]})
  } catch(error) {
    return response.status(500).json('Internal Server Error')
  }
});

app.get('/api/v1/titles/:id', async (request, response) => {
  const { id } = request.params

  if(!parseInt(id)) {
    return response.status(422).json({ error: 'Incorrect ID:' + id })
  }
  
  try {
    const titles  = await database('titles').where('id', id).select();
    if(!titles.length) {
      return response.status(404).json({ error: 'Could not find title with ID:' + id })
    }
    return response.status(200).json({title: titles[0]})
  } catch(error) {
    return response.status(500).json('Internal Server Error')
  }
});

app.post('/api/v1/metros', async (request, response) => {
  const newMetro = request.body;
  
  for (let requiredParam of [ 'metro', 'population', 'teams' ]) {
    if (!newMetro[requiredParam]) {
      return response.status(422).send({ error: `Expected format: { metro: <String>, population: <Number>, type: <String>}. Missing a ${requiredParam} property.`})
      }
    }

  try {
    const metroId = await database('metros').insert(newMetro, 'id')
    return response.status(201).json({ metro: { id: metroId[0], ...newMetro }});
  } catch(error) {
    return response.status(500).json("Internal Server Error")
  }
});

app.post('/api/v1/titles/:metro_id/titles', async (request, response) => {
  const titleRequest = request.body;
  const { metro_id } = request.params;
  
  for (let requiredParam of [ 'year', 'level', 'sport', 'winner', 'title_metro' ]) {
    if (!titleRequest[requiredParam]) {
      return response.status(422).send({ error: `Expected format: { year: <Number>, level: <String>, sport: <String>, winner: <string>, title_mtero: <String>}. Missing a ${requiredParam} property.`})
    }
  }

  const titleToAdd = {
    metro_id: parseInt(metro_id),
    year: titleRequest.year,
    level: titleRequest.level,
    winner: titleRequest.winner,
    title_metro: titleRequest.title_metro
  }

  try {
    const newTitleId = await database('titles').insert(titleToAdd, 'id')
    return response.status(201).json({ title: { id: newTitleId[0], ...titleToAdd }});
  } catch(error) {
    return response.status(500).json("Internal Server Error")
  }
});
  
app.delete('/api/v1/titles/:id', async (request,response) => {
  const { id } = request.params;
  const titles = await database('titles').select();
  const getTitleToDelete = titles.find(title => title.id === parseInt(id));

  try {
    if(!getTitleToDelete) {
      return response.status(400).json({ error: 'Could not find title with ID:' + id })
    }
    database('titles').where('id', getTitleToDelete).del();
    return response.status(200).json({ message: 'Success: Title has been removed'})
  } catch(error) {
    return response.status(500).json('Internal Server Error')
  }
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
});


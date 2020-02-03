const express = require('express');
//brings in the express framework to use with Node
const app = express();
//creates app


const environment = process.env.NODE_ENV || 'development';
//creates the envirornment that we will use for production (Heroku) or development
const configuration = require('./knexfile')[environment];
//the ./knexfile links our migrations, seed directories and determines which env we will use
const database = require('knex')(configuration);
//creates database using postgreSQL

app.use(express.json());
//tells the app to json our file


app.set('port', process.env.PORT || 3000);
//sets the port where we are going to run our app
app.locals.title = 'BYOB';
//sends a response body with 'BYOB' when called

app.get('/api/v1/metros', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn
  try {
    const metros = await database('metros').select();
      //set the variable to the database 'metros'
    return response.status(200).json(metros)
      //set the status code to 200, send a response body that will include a successful status code and return all metros in datdabase
  } catch(error) {
      //if somthing is wrong in the try, run the catch 
    return response.status(500).json('Internal Server Error')
      //send a 500 level reponse with a custom string 
  }
});

app.get('/api/v1/titles', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn

  try {
    //if the url is right, try and do this...
    const titles = await database('titles').select();
    //set the variable to the database 'titles'
    return response.status(200).json(titles)
    //set the status code to 200, send a response body that will include a successful status code and return all titles in datdabase
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json('Internal Server Error')
    //send a 500 level reponse with a custom string 

  }
});

app.get('/api/v1/metros/:id', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn

  const { id } = request.params
  //get the id from the request, destructure, and set to a variable of id

  if(!parseInt(id)) {
  //check to see if there is a number value for the id above, 'does this id exists?'
    return response.status(422).json({ error: 'Incorrect ID:' + id })
  //if there is no id then send a 422 response with a error message that includes the id
  }
  try {
    const metro  = await database('metros').where('id', id).select();
    //goes into the database based the argument passed in, goes to the id column, and selects the matching id
    if(!metro.length) {
      //if there is no length to the metros database then return the response below
      return response.status(404).json({ error: 'Could not find metro with ID:' + id })
      //if there is no id then send a 422 response with a error message that includes the id
    }
    return response.status(200).json({metro: metro[0]})
    //return a 200 level response with an object with the key of metro and the value of the metro at index 0
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json('Internal Server Error')
    //send a 500 level reponse with a custom string 
  }
});

app.get('/api/v1/titles/:id', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn

  const { id } = request.params
  //get the id from the request, destructure, and set to a variable of id

  if(!parseInt(id)) {
    //check to see if there is a number value for the id above, 'does this id exists?'
    return response.status(422).json({ error: 'Incorrect ID:' + id })
    //if there is no id then send a 422 response with a error message that includes the id
  }
  try {
    const titles  = await database('titles').where('id', id).select();
    //goes into the database based the argument passed in, goes to the id column, and selects the matching id
    if(!titles.length) {
      //if there is no length to the titles database then return the response below
      return response.status(404).json({ error: 'Could not find title with ID:' + id })
      //if there is no id then send a 422 response with a error message that includes the id
    }
    return response.status(200).json({title: titles[0]})
    //return a 200 level response with an object with the key of title and the value of the title at index 0
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json('Internal Server Error')
    //send a 500 level reponse with a custom string 
  }
});

app.post('/api/v1/metros', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn
  const newMetro = request.body;
  //get the whole request body, and set that to a variable 
  
  for (let requiredParam of [ 'metro', 'population', 'teams' ]) {
    //set a variable to a list of required properties 
    if (!newMetro[requiredParam]) {
    //checks to make sure all those properties are included in the request
      return response.status(422).send({ error: `Expected format: { metro: <String>, population: <Number>, type: <String>}. Missing a ${requiredParam} property.`})
    //if the property is not included then return a 422 level error and a message informing the user what needs to be included 
      }
    }

  try {
    const metroId = await database('metros').insert(newMetro, 'id')
    //goes into the database defined by the argument we pass in and inserts a new entry, the first argument is what we give insert and what we return
    return response.status(201).json({ id: metroId[0] });
    //return a 200 level response with an object with the key of id and the value of the new id
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json("Internal Server Error")
    //send a 500 level reponse with a custom string 
  }
});

app.post('/api/v1/titles/:metro_id/titles', async (request, response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn
  const titleRequest = request.body;
  //get the whole request body, and set that to a variable 
  const { metro_id } = request.params;
  //get the metro_id from the request, destructure, and set to a variable of metro_id
  
  for (let requiredParam of [ 'year', 'level', 'sport', 'winner', 'title_metro' ]) {
  //set a variable to a list of required properties 
    if (!titleRequest[requiredParam]) {
  //checks to make sure all those properties are included in the request
      return response.status(422).send({ error: `Expected format: { year: <Number>, level: <String>, sport: <String>, winner: <string>, title_mtero: <String>}. Missing a ${requiredParam} property.`})
  //if the property is not included then return a 422 level error and a message informing the user what needs to be included 
    }
  }

  const titleToAdd = {
    //here we create a new object with the information in the request body
    metro_id: Number(metro_id),
    year: titleRequest.year,
    level: titleRequest.level,
    winner: titleRequest.winner,
    title_metro: titleRequest.title_metro
  }

  try {
    const newTitleId = await database('titles').insert(titleToAdd, 'id')
    //goes into the database defined by the argument we pass in and inserts a new entry, the first argument is what we give insert and what we return
    return response.status(201).json({ title: { id: newTitleId[0], ...titleToAdd }});
    //return a 200 level response with an object with the key of title and the value of the new id, plus the new title information 
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json("Internal Server Error")
    //send a 500 level reponse with a custom string 
  }
});
  
app.delete('/api/v1/titles/:id', async (request,response) => {
  //defines what type of request we will have and to which endpoint, also that it is an async fn
  const { id } = request.params;
  //get the id from the request, destructure, and set to a variable of id
  const titles = await database('titles').select();
  //finds the database by the argument passed in then selects that table, and assigns it to a variable. This function is also asnyc
  const getTitleToDelete = titles.find(title => title.id === parseInt(id));
  //uses the data in the titles database to match the id from the request body to an id in the titles array
  
  try {
    if(!getTitleToDelete) {
    //if this item, in this case the matching object does not exist then send following response
      return response.status(400).json({ error: 'Could not find title with ID:' + id })
    //if there is no id then send a 400 response with an error message that includes the id
    }
    database('titles').where('id', getTitleToDelete).del();
    //goes into the database defined by the argument we pass in, finds it by id, and deletes it
    return response.status(200).json({ message: 'Success: Title has been removed'})
    //if there is no id then send a 200 response with a custom string leting the user know the title has been removed 
  } catch(error) {
    //if somthing is wrong in the try, run the catch 
    return response.status(500).json('Internal Server Error')
    //send a 500 level reponse with a custom string 
  }
})


app.listen(app.get('port'), () => {
//when the app is successfully running on a port, this will be triggered
  console.log(`${app.locals.title} is running on http://localhost:${app.get('port')}.`);
//print message in the console, which tells us what port we are running on
});


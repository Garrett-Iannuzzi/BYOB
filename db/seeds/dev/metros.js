const metroData = require('../../../data/metroData');
const titleData = require('../../../data/titleData');
// Reduce titleData to be an object with keys of metros. ie: 
// titleData.js should now be a giant object that looks like this: 
// {
//   'Ontario, CO': [
//       {title},
//       {title}, 
//   ]
// }
// Then the if block can be something like: 
// let titlePromises = titleData[metro].map(title => createTitle(title))

const createMetro = async (knex, metro) => {
  const metroId = await knex('metros').insert({
    metro: metro.metro,
    population: metro.population,
    teams: metro.teamArray.team
  }, 'id');

  let titlePromises = titleData.map(title => {
      return createTitle(knex, {
        year: title.year,
        level: title.level,
        sport: title.sport,
        winner: title.winner,
        title_metro: title.winner_metro,
        metro_id: metroId[0]
      })
  })
  return Promise.all(titlePromises)
}

const createTitle = (knex, title) => {
  return knex('titles').insert(title)
}

exports.seed = async (knex) => {
  try {
    await knex('titles').del();
    await knex('metros').del();

    let titlePromises = titleData.map(title => {
      return createTitle(knex, title)
    });

    let metroPromises = metroData.map(metro => {
      return createMetro(knex, metro)
    });

    return Promise.all(metroPromises, titlePromises)
  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }
}

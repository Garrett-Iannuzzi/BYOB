const metroData = require('./metroData');
const titleData = require('./titleData');

const createMetro = async (knex, metro) => {
  const metroId = await knex('metros').insert({
    metro: metro.metro,
    population: metro.population,
    teams: metro.teamArray 
  }, 'id');

  let titlePromises = titleData.map(title => {
    if (title.winner_metro === metro.metro) {
      return createTitle(knex, {
        year: title.year,
        level: title.level,
        sport: title.sport,
        winner: title.winner,
        title_metro: title.winner_metro,
        metro_id: metroId[0]
      })
    }
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

const metroData = require('../../../data/metroData');
const titleData = require('../../../data/titleData');

const createMetro = async (knex, metro) => {
  const metroId = await knex('metros').insert({
    metro: metro.metro,
    population: metro.population,
    teams: metro.teamArray.sport
  }, 'id');

  const metroTitles = titleData.filter(title => {
    return title.winner_metro === metro.metro
  })

  let titlePromises = metroTitles.map(title => {
      return createTitle(knex, {
          year: title.year,
          level: title.level,
          sport: title.sport,
          winner: title.winner,
          title_metro: title.winner_metro,
          metro_id: metroId[0]
        }
      );
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

    let metroPromises = metroData.map(metro => {
      return createMetro(knex, metro)
    });

    return Promise.all(metroPromises)
  } catch (error) {
    console.log(`Error seeding data: ${error}`)
  }
}

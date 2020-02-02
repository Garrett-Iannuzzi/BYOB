## BYOB

### Overview:
- Build a RESTful backend API



### API Endpoints:
| Purpose  | URL  | Verb  | Request Body  | Sample Success Response  |
|---|---|---|---|---|
|  **Get all metro areas in database** |  **/api/v1/metros** |  GET | N/A  | **Array of metros:** ```[ { "id": 21145, "metro": "Winnipeg, MB", "population": 778489, "teams": null "created_at": "2020-02-02T00:21:50.651Z", "updated_at": "2020-02-02T00:21:50.651Z" }, { "id": 21146, "metro": "Ottawa, ON", "population": 1323783, "teams": null,"created_at": "2020-02-02T00:21:50.653Z", "updated_at": "2020-02-02T00:21:50.653Z" } ...]``` |
| **Get all titles in database**  |  **api/v1/titles** |  GET | N/A | **Array of titles:** ```[ { "id": 4235802, "year": 1971, "level": "pro", "sport": "CFL", "winner": "Calgary Stampeders","title_metro": "Calgary, AB", "metro_id": 21151,"created_at": "2020-02-02T00:21:50.843Z", "updated_at": "2020-02-02T00:21:50.843Z" }, { "id": 4235815, "year": 1931, "level": "pro", "sport": "NHL", "winner": "Montreal Canadiens", "title_metro": "Montreal, QC", "metro_id": 21147, "created_at": "2020-02-02T00:21:50.851Z","updated_at": "2020-02-02T00:21:50.851Z" } ...]``` |
| **Get a single metro area by it's ID**   |  **api/v1/metros/:id** |  GET |  N/A | **Single metro:** ``` { "metro": { "id": 21164,"metro": "Denver, CO", "population": 2888227, "teams": null, "created_at": "2020-02-02T00:21:50.677Z","updated_at": "2020-02-02T00:21:50.677Z" } }``` |
| **Get a single title by it's ID**  |  **api/v1/titles/:id**  | GET  | N/A  | **Single title:** ```{ "title": { "id": 4236246,"year": 1998, "level": "pro", "sport": "NFL", "winner": "Denver Broncos", "title_metro": "Denver, CO", "metro_id": 21164, "created_at": "2020-02-02T00:21:51.013Z","updated_at": "2020-02-02T00:21:51.013Z" } }```  |
|  **Post new metro area** | **/api/v1/metros**  |  POST | **New metro:** ```{ "metro": "Zanzabar", "population": 10, "teams": "Zoonies" }```  | **New metro ID:** ```{ "id": 21497 } ``` |
|  **Post new title to metro area** | /api/v1/titles/:metro_id/titles  |  POST |  **New title:** ```{ year: 2021, level: 'pro', sport: 'NFL', 'winner: 'Denver Broncos', title_metro: 'Denver, CO', metro_id: 21164 }``` |  **New title:** ```{ title: { "id": 4236779, "year": 2021, "level": "pro", "sport": null, "winner": "Denver Broncos", "title_metro": "Denver, CO","metro_id": 21164 } }```
|   |   |  DELETE |   |   |

Movies
======
Project for users to rate their favourite movies

Has a script to pull some movie data from TMDB

10 different users with different genre preferences are autogenerated on startup. Random ratings are generated for each user

The project then runs tensorflow to generate movie recommendations for each user based on their prior ratings

The project contains an API to create new users and make ratings


How to run
==========
```bash
docker-compose up -d
npm run seed
npm run start
```


In progress
===========
:rocket: Deploy process on merge with jenkins

:earth_africa: Host on AWS

:rocket: basic React / Material UI or similar frontend

:chart: api to create users / submit ratings

:closed_lock_with_key: api auth
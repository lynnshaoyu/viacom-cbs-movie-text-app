To run app in local host, make sure port 3000 is free. Then follow these steps:
1. Run npm install in root directory (movie-text-app)
2. Run npm start

External libraries used:
1. react-semantic-ui-range
2. semantic-ui-react

The app running in your browser should look like:
![alt text](https://github.com/lynnshaoyu/viacom-cbs-movie-text-app/blob/main/movie-text-app-screenshot.png?raw=true)

Note: data folder contains all relevant json files used in this app, as well as original txt files. It also contains data_generator.py which is what was used to convert txt files to relevant jsons.

This is a data visualization app that allows users to easily filter and search through more than 300,000 lines of movie line data. Did not have time to utilize movie conversation data (would add in future TODO). Backend portion that would utilize a database and serve up data through APIs has not been built, so we are directly using jsons in the frontend portion. 

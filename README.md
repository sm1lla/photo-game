# Photo Guess Game

This is an interactive online game to play with your friends. For our API and Webservices class we implemented this project which encompasses both client-side and server-side functionalities. Let's go! 🐣

## How to run

You need to start 5 different services. First, go into each of the folders `frontend`, `backend_game`, `backend_data` and `backend_authorization` and run `npm install`.

Then go to the `backend_authorization` folder and run `pm2 start app.js --name "backend-auth1"` and `pm2 start dbserver.js --name "backend-auth2"`. 

In the folder `backend_data` run `pm2 start app.js --name "backend-data"`.

In the folder `backend_game` run `pm2 start app.js --name "backend-game"`.

In the folder `frontend` run `npm run build` and then `pm2 serve build/ 3000 --name "frontend" --spa`

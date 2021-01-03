# node-notes-app

Silly exercise involving fs and yargs modules. Takes notes as inputs from the command line. Add, update, remove, list and get operations.

node src/app.js {operation} {parameters}

e.g.:
node src/app.js add --title="Note title" --body="Note body"
node src/app.js remove --title="Note title"
node src/app.js list
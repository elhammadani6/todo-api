const { v4: uuidv4 } = require('uuid');

let todos = [
  {
    "id": uuidv4(),
    "title": "Study REST APIs",
    "description": "Read a dissertation by Roy Fielding",
    "state": "todo",
    "createdAt": new Date().toISOString(),
    "updatedAt": new Date().toISOString()
  }
];

module.exports = todos;
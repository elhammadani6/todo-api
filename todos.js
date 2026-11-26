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

function toCsv(todosList) {
    return [
        ["id", "title", "description", "state", "createdAt", "updatedAt"],
        ...todosList.map(item => [
            item.id,
            `"${item.title}"`,
            `"${item.description || ''}"`,
            item.state,
            item.createdAt,
            item.updatedAt
        ])
    ].map(e => e.join(",")).join("\n");
}

module.exports = {
    getTodos: () => todos,
    toCsv
};
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getTodos, toCsv } = require('../todos');

// 1. GET /todos (با پشتیبانی از JSON و CSV)
/**
 * @openapi
 * /todos:
 *   get:
 *     summary: Get all todos
 *     description: Retrieve a list of todos. Can filter by state and supports JSON or CSV output.
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [todo, doing, done]
 *         description: Filter todos by state
 *     responses:
 *       200:
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
    const { state } = req.query;
    let filteredTodos = getTodos();

    if (state) {
        filteredTodos = filteredTodos.filter(t => t.state === state);
    }

    const format = req.accepts(['application/json', 'text/csv']);

    if (format === 'text/csv') {
        const csvData = toCsv(filteredTodos);
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(csvData);
    }

    res.status(200).json(filteredTodos);
});

// 2. GET /todos/:id
router.get('/:id', (req, res) => {
    const todos = getTodos();
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
});

// 3. POST /todos
router.post('/', (req, res) => {
    const { title, description, state } = req.body;
    const todos = getTodos();

    // اعتبارسنجی
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    const validStates = ['todo', 'doing', 'done'];
    if (state && !validStates.includes(state)) {
        return res.status(400).json({ error: 'State must be todo, doing, or done' });
    }

    const newTodo = {
        id: uuidv4(),
        title,
        description: description || '',
        state: state || 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 4. PUT /todos/:id
router.put('/:id', (req, res) => {
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, description, state } = req.body;

    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string' });
    }
    const validStates = ['todo', 'doing', 'done'];
    if (state && !validStates.includes(state)) {
        return res.status(400).json({ error: 'State must be todo, doing, or done' });
    }

    todos[index] = {
        ...todos[index],
        title: title || todos[index].title,
        description: description !== undefined ? description : todos[index].description,
        state: state || todos[index].state,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json(todos[index]);
});

// 5. DELETE /todos/:id
router.delete('/:id', (req, res) => {
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const deleted = todos.splice(index, 1);
    res.status(200).json({ message: 'Todo deleted successfully', deleted: deleted[0] });
});

module.exports = router;
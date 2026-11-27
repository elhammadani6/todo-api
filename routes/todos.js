const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const { getTodos, toCsv } = require('../todos');

// 1. GET /todos
/**
 * @openapi
 * /todos:
 *   get:
 *     summary: Get all todos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *           enum: [todo, doing, done]
 *     responses:
 *       200:
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *           text/csv:
 *             schema:
 *               type: string
 */
router.get('/', (req, res) => {
    const { state } = req.query;
    let filteredTodos = getTodos();
    if (state) filteredTodos = filteredTodos.filter(t => t.state === state);

    const format = req.accepts(['application/json', 'text/csv']);
    if (format === 'text/csv') {
        const csvData = toCsv(filteredTodos);
        res.setHeader('Content-Type', 'text/csv');
        return res.status(200).send(csvData);
    }
    res.status(200).json(filteredTodos);
});

// 2. GET /todos/:id
/**
 * @openapi
 * /todos/{id}:
 *   get:
 *     summary: Get a single todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo found
 *       404:
 *         description: Todo not found
 */
router.get('/:id', (req, res) => {
    const todos = getTodos();
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) return res.status(404).json({ error: 'Todo not found' });
    res.status(200).json(todo);
});

// 3. POST /todos
/**
 * @openapi
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [todo, doing, done]
 *     responses:
 *       201:
 *         description: Todo created
 *       400:
 *         description: Invalid input
 */
router.post('/', (req, res) => {
    const { title, description, state } = req.body;
    const todos = getTodos();
    if (!title || typeof title !== 'string') return res.status(400).json({ error: 'Title is required' });
    const validStates = ['todo', 'doing', 'done'];
    if (state && !validStates.includes(state)) return res.status(400).json({ error: 'Invalid state' });

    const newTodo = {
        id: uuidv4(), title, description: description || '', 
        state: state || 'todo', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
});

// 4. PUT /todos/:id
/**
 * @openapi
 * /todos/{id}:
 *   put:
 *     summary: Update a todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               state:
 *                 type: string
 *                 enum: [todo, doing, done]
 *     responses:
 *       200:
 *         description: Todo updated
 *       404:
 *         description: Todo not found
 */
router.put('/:id', (req, res) => {
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    const { title, description, state } = req.body;
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
/**
 * @openapi
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Todo deleted
 *       404:
 *         description: Todo not found
 */
router.delete('/:id', (req, res) => {
    const todos = getTodos();
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Todo not found' });

    const deleted = todos.splice(index, 1);
    res.status(200).json({ message: 'Todo deleted successfully', deleted: deleted[0] });
});

module.exports = router;
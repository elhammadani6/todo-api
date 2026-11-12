const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 3000;

// میان‌افزار برای خواندن JSON در بدنه درخواست‌ها
app.use(express.json());

// شبیه‌سازی دیتابیس با آرایه (از فایل todos.js می‌خوانیم)
let todos = require('./todos');

// 1. GET /todos (با قابلیت فیلتر بر اساس state)
app.get('/todos', (req, res) => {
    const { state } = req.query;
    if (state) {
        const filtered = todos.filter(t => t.state === state);
        return res.status(200).json(filtered);
    }
    res.status(200).json(todos);
});

// 2. GET /todos/:id (دریافت یک آیتم)
app.get('/todos/:id', (req, res) => {
    const todo = todos.find(t => t.id === req.params.id);
    if (!todo) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    res.status(200).json(todo);
});

// 3. POST /todos (ساخت آیتم جدید)
app.post('/todos', (req, res) => {
    const { title, description, state } = req.body;

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

// 4. PUT /todos/:id (به‌روزرسانی)
app.put('/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const { title, description, state } = req.body;

    // اعتبارسنجی
    if (title && typeof title !== 'string') {
        return res.status(400).json({ error: 'Title must be a string' });
    }
    const validStates = ['todo', 'doing', 'done'];
    if (state && !validStates.includes(state)) {
        return res.status(400).json({ error: 'State must be todo, doing, or done' });
    }

    // به‌روزرسانی
    todos[index] = {
        ...todos[index],
        title: title || todos[index].title,
        description: description !== undefined ? description : todos[index].description,
        state: state || todos[index].state,
        updatedAt: new Date().toISOString()
    };

    res.status(200).json(todos[index]);
});

// 5. DELETE /todos/:id (حذف)
app.delete('/todos/:id', (req, res) => {
    const index = todos.findIndex(t => t.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }

    const deleted = todos.splice(index, 1);
    res.status(200).json({ message: 'Todo deleted successfully', deleted: deleted[0] });
});

// اجرای سرور
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
const request = require('supertest');
const BASE_URL = 'http://localhost:3000';

describe('Todos API (integration)', () => {
  let createdId;

  test('GET /todos → 200 and returns array', async () => {
    const res = await request(BASE_URL).get('/todos');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('POST /todos → 201 creates todo', async () => {
    const res = await request(BASE_URL)
      .post('/todos')
      .send({ title: 'Test todo', description: 'from test', state: 'todo' });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    createdId = res.body.id; 
  });

  test('POST /todos → 400 when title missing', async () => {
    const res = await request(BASE_URL)
      .post('/todos')
      .send({ description: 'no title' });
    expect(res.status).toBe(400);
  });

  test('GET /todos/:id → 200 for created todo', async () => {
    const res = await request(BASE_URL).get(`/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(createdId);
  });

  test('GET /todos/:id → 404 for missing', async () => {
    const res = await request(BASE_URL).get('/todos/12345');
    expect(res.status).toBe(404);
  });

  test('PUT /todos/:id → 200 updates state', async () => {
    const res = await request(BASE_URL)
      .put(`/todos/${createdId}`)
      .send({ state: 'doing' });
    expect(res.status).toBe(200);
    expect(res.body.state).toBe('doing');
  });

  test('DELETE /todos/:id → 200 for existing', async () => {
    const res = await request(BASE_URL).delete(`/todos/${createdId}`);
    expect(res.status).toBe(200);
    expect(res.body.deleted.id).toBe(createdId);
  });
});
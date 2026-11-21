const VALID_STATES = ['todo', 'doing', 'done'];

function validateCreate(body) {
  const { title, state } = body;
  if (!title || typeof title !== 'string') {
    return { error: 'Title is required and must be a string', status: 400 };
  }
  if (state && !VALID_STATES.includes(state)) {
    return { error: 'State must be todo, doing, or done', status: 400 };
  }
  return { ok: true };
}

function validateUpdate(body) {
  const { title, state } = body;
  if (title && typeof title !== 'string') {
    return { error: 'Title must be a string', status: 400 };
  }
  if (state && !VALID_STATES.includes(state)) {
    return { error: 'State must be todo, doing, or done', status: 400 };
  }
  return { ok: true };
}

describe('Validation logic (unit)', () => {
  describe('validateCreate', () => {
    test('accepts valid payload', () => {
      expect(validateCreate({ title: 'X', state: 'todo' })).toEqual({ ok: true });
    });

    test('rejects missing title', () => {
      expect(validateCreate({}).status).toBe(400);
    });

    test('rejects invalid state', () => {
      expect(validateCreate({ title: 'X', state: 'bad' }).status).toBe(400);
    });
  });

  describe('validateUpdate', () => {
    test('accepts partial update (state only)', () => {
      expect(validateUpdate({ state: 'doing' })).toEqual({ ok: true });
    });

    test('rejects non-string title', () => {
      expect(validateUpdate({ title: 123 }).status).toBe(400);
    });
  });
});
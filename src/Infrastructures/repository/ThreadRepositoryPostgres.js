const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const CreatedThread = require('../../Domains/threads/entities/CreatedThread');
const ThreadRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(userId, thread) {
    const { title, content } = thread;
    const id = `thread-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO threads(id, title, content, user_id) VALUES($1, $2, $3, $4) RETURNING id, title, user_id',
      values: [id, title, content, userId],
    };

    const result = await this._pool.query(query);

    return new CreatedThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async findThreadById(id) {
    const query = {
      text: 'SELECT id, title, user_id FROM threads WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return new CreatedThread({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async getThreadWithCreatorById(id) {
    const query = {
      text: `
        SELECT t.id, t.title, t.content, t.date, u.username
        FROM threads t
        INNER JOIN users u
        ON u.id = t.user_id
        WHERE t.id = $1
      `,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    const thread = result.rows[0];

    return {
      id: thread.id,
      title: thread.title,
      body: thread.content,
      date: thread.date,
      username: thread.username,
    };
  }
}

module.exports = ThreadRepositoryPostgres;

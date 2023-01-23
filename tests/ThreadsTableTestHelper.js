/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
  async getThreadsByUserId(userId) {
    const query = {
      text: 'SELECT * FROM threads WHERE user_id = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addThread({
    id = 'thread-123',
    title = 'Dicoding',
    content = 'Dicoding content',
    date = new Date(),
    userId,
  }) {
    if (!userId) throw new Error('please insert userId');

    const query = {
      text: 'INSERT INTO threads(id, title, content, user_id, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, title, content, userId, date],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM threads WHERE 1=1');
  },
};

module.exports = ThreadsTableTestHelper;

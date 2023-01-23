/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
  async getCommentsByUserId(userId) {
    const query = {
      text: 'SELECT * FROM comments WHERE user_id = $1',
      values: [userId],
    };

    const result = await pool.query(query);
    return result.rows;
  },

  async addComment({
    id = 'comment-123',
    content = 'Dicoding',
    date = new Date(),
    threadId,
    userId,
  }) {
    if (!userId || !threadId) {
      throw new Error('please insert userId and threadId');
    }

    const query = {
      text: 'INSERT INTO comments(id, content, user_id, thread_id, date) VALUES($1, $2, $3, $4, $5)',
      values: [id, content, userId, threadId, date],
    };

    await pool.query(query);
  },

  async cleanTable() {
    await pool.query('DELETE FROM comments WHERE 1=1');
  },
};

module.exports = CommentsTableTestHelper;

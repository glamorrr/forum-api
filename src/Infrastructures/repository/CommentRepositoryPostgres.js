const CreatedComment = require('../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const DeletedComment = require('../../Domains/comments/entities/DeletedComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(userId, comment) {
    const { threadId, content } = comment;
    const id = `comment-${this._idGenerator()}`;

    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, user_id',
      values: [id, content, userId, threadId],
    };

    const result = await this._pool.query(query);

    return new CreatedComment({
      ...result.rows[0],
      owner: result.rows[0].user_id,
    });
  }

  async deleteComment(userId, comment) {
    const { threadId, commentId } = comment;

    const query = {
      text: 'UPDATE comments SET is_delete = TRUE WHERE id = $1 AND thread_id = $2 AND user_id = $3',
      values: [commentId, threadId, userId],
    };

    await this._pool.query(query);
    return new DeletedComment({ id: commentId });
  }

  async findCommentInThread({ commentId, threadId }) {
    const query = {
      text: 'SELECT user_id FROM comments WHERE id = $1 AND thread_id = $2',
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('comment tidak ditemukan');
    }

    return {
      userId: result.rows[0].user_id,
    };
  }

  async getCommentsWithCreatorByThreadId(threadId) {
    const query = {
      text: `
        SELECT c.id, u.username, c.content, c.date, c.is_delete AS "isDelete"
        FROM comments c
        INNER JOIN threads t
        ON t.id = c.thread_id
        INNER JOIN users u
        ON u.id = c.user_id
        WHERE c.thread_id = $1
        ORDER BY c.date ASC
      `,
      values: [threadId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new NotFoundError('thread tidak ditemukan');
    }

    return result.rows;
  }
}

module.exports = CommentRepositoryPostgres;

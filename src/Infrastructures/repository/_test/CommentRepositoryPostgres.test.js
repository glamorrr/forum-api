const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');

describe('CommentRepositoryPostgres', () => {
  const userId = 'user-123';
  const threadId = 'thread-123';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'dicoding',
    });
    await ThreadsTableTestHelper.addThread({
      id: threadId,
      userId,
    });
  });

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist created comment', async () => {
      // Arrange
      const comment = new CreateComment({
        content: 'content dicoding',
        threadId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await commentRepositoryPostgres.addComment(userId, comment);

      // Assert
      const comments = await CommentsTableTestHelper.getCommentsByUserId(
        userId
      );
      expect(comments).toHaveLength(1);
    });

    it('should return created comment correctly', async () => {
      // Arrange
      const comment = new CreateComment({
        content: 'content dicoding',
        threadId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const commentRepositoryPostgres = new CommentRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdComment = await commentRepositoryPostgres.addComment(
        userId,
        comment
      );

      // Assert
      expect(createdComment).toStrictEqual(
        new CreatedComment({
          id: 'comment-123',
          content: 'content dicoding',
          owner: userId,
        })
      );
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        userId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const deletedComment = await commentRepositoryPostgres.deleteComment(
        'user-123',
        new DeleteComment({
          threadId: 'thread-123',
          commentId: 'comment-123',
        })
      );
      // Assert
      const comments = await CommentsTableTestHelper.getCommentsByUserId(
        userId
      );
      expect(comments[0].is_delete).toEqual(true);
      expect(deletedComment).toStrictEqual(
        new DeletedComment({ id: 'comment-123' })
      );
    });
  });

  describe('findCommentInThread function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.findCommentInThread({
          threadId: 'thread-404',
          commentId: 'comment-404',
        })
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comment when comment is found', async () => {
      // Arrange
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        threadId,
        userId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment = await commentRepositoryPostgres.findCommentInThread({
        threadId: 'thread-123',
        commentId: 'comment-123',
      });

      // Assert
      expect(comment).toStrictEqual({ userId: 'user-123' });
    });
  });

  describe('getCommentsWithCreatorByThreadId function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        commentRepositoryPostgres.getCommentsWithCreatorByThreadId('thread-404')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return comments with user info', async () => {
      // Arrange
      const dummyDate1 = new Date();
      const dummyDate2 = new Date();
      await CommentsTableTestHelper.addComment({
        id: 'comment-123',
        content: 'content 1',
        date: dummyDate1,
        threadId,
        userId,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-234',
        content: 'content 2',
        date: dummyDate2,
        threadId,
        userId,
      });
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      // Action
      const comment =
        await commentRepositoryPostgres.getCommentsWithCreatorByThreadId(
          threadId
        );

      // Assert
      expect(comment).toStrictEqual([
        {
          id: 'comment-123',
          username: 'dicoding',
          date: dummyDate1,
          content: 'content 1',
          isDelete: false,
        },
        {
          id: 'comment-234',
          username: 'dicoding',
          date: dummyDate2,
          content: 'content 2',
          isDelete: false,
        },
      ]);
    });
  });
});

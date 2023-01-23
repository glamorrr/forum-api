const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const CreateThread = require('../../../Domains/threads/entities/CreateThread');
const CreatedThread = require('../../../Domains/threads/entities/CreatedThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');

describe('ThreadRepositoryPostgres', () => {
  const userId = 'user-321';

  beforeAll(async () => {
    await UsersTableTestHelper.addUser({
      id: userId,
      username: 'dicoding',
    });
  });

  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('findThreadById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.findThreadById('thread-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread when thread is found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        userId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const thread = await threadRepositoryPostgres.findThreadById(
        'thread-123'
      );

      // Assert
      expect(thread).toStrictEqual(
        new CreatedThread({
          id: 'thread-123',
          title: 'dicoding',
          owner: userId,
        })
      );
    });
  });

  describe('addThread function', () => {
    it('should persist created thread', async () => {
      // Arrange
      const thread = new CreateThread({
        title: 'dicoding',
        content: 'content dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      await threadRepositoryPostgres.addThread(userId, thread);

      // Assert
      const threads = await ThreadsTableTestHelper.getThreadsByUserId(userId);
      expect(threads).toHaveLength(1);
    });

    it('should return created thread correctly', async () => {
      // Arrange
      const thread = new CreateThread({
        title: 'dicoding',
        content: 'content dicoding',
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const createdThread = await threadRepositoryPostgres.addThread(
        userId,
        thread
      );

      // Assert
      expect(createdThread).toStrictEqual(
        new CreatedThread({
          id: 'thread-123',
          title: 'dicoding',
          owner: userId,
        })
      );
    });
  });

  describe('getThreadWithCreatorById function', () => {
    it('should throw NotFoundError when thread not found', () => {
      // Arrange
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      // Action & Assert
      return expect(
        threadRepositoryPostgres.getThreadWithCreatorById('thread-123')
      ).rejects.toThrowError(NotFoundError);
    });

    it('should return thread with username when thread is found', async () => {
      // Arrange
      const currentDate = new Date();
      await ThreadsTableTestHelper.addThread({
        id: 'thread-123',
        title: 'dicoding',
        content: 'content',
        date: currentDate,
        userId,
      });
      const fakeIdGenerator = () => '123'; // stub!
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(
        pool,
        fakeIdGenerator
      );

      // Action
      const thread = await threadRepositoryPostgres.getThreadWithCreatorById(
        'thread-123'
      );

      // Assert
      expect(thread).toStrictEqual({
        id: 'thread-123',
        title: 'dicoding',
        body: 'content',
        date: currentDate,
        username: thread.username,
      });
    });
  });
});

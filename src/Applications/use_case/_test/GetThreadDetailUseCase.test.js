const ThreadDetail = require('../../../Domains/threads/entities/ThreadDetail');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const GetThreadDetailUseCase = require('../GetThreadDetailUseCase');

describe('GetThreadDetailUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const currentDate = new Date();
    const tomorrowDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const useCasePayload = {
      threadId: 'thread-123',
    };
    const expectedThreadDetail = new ThreadDetail({
      id: 'thread-123',
      title: 'sebuah thread',
      body: 'sebuah body thread',
      date: currentDate,
      username: 'dicoding',
      comments: [
        {
          id: 'comment-123',
          username: 'johndoe',
          date: currentDate,
          content: '**komentar telah dihapus**',
        },
        {
          id: 'comment-234',
          username: 'johndoe',
          date: tomorrowDate,
          content: 'threadnya keren banget',
        },
      ],
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockThreadRepository.getThreadWithCreatorById = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve({
          id: 'thread-123',
          title: 'sebuah thread',
          body: 'sebuah body thread',
          date: currentDate,
          username: 'dicoding',
        })
      );
    mockCommentRepository.getCommentsWithCreatorByThreadId = jest
      .fn()
      .mockImplementation(() =>
        Promise.resolve([
          {
            id: 'comment-123',
            username: 'johndoe',
            date: currentDate,
            content: 'sebuah comment',
            isDelete: true,
          },
          {
            id: 'comment-234',
            username: 'johndoe',
            date: tomorrowDate,
            content: 'threadnya keren banget',
            isDelete: false,
          },
        ])
      );

    /** creating use case instance */
    const getThreadDetailUseCase = new GetThreadDetailUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const threadDetail = await getThreadDetailUseCase.execute(useCasePayload);

    // Assert
    expect(threadDetail).toStrictEqual(expectedThreadDetail);
    expect(mockThreadRepository.getThreadWithCreatorById).toBeCalledWith(
      'thread-123'
    );
    expect(
      mockCommentRepository.getCommentsWithCreatorByThreadId
    ).toBeCalledWith('thread-123');
  });
});

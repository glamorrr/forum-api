const CreateComment = require('../../../Domains/comments/entities/CreateComment');
const CreatedComment = require('../../../Domains/comments/entities/CreatedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CreateCommentUseCase = require('../CreateCommentUseCase');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');

describe('CreateCommentUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      content: 'content',
      threadId: 'thread-123',
    };
    const expectedCreatedComment = new CreatedComment({
      id: 'thread-123',
      content: useCasePayload.content,
      owner: 'user-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    const mockThreadRepository = new ThreadRepository();

    /** mocking needed function */
    mockCommentRepository.addComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedCreatedComment));
    mockThreadRepository.findThreadById = jest
      .fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const createCommentUseCase = new CreateCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    // Action
    const createdComment = await createCommentUseCase.execute(
      'user-123',
      useCasePayload
    );

    // Assert
    expect(createdComment).toStrictEqual(expectedCreatedComment);
    expect(mockThreadRepository.findThreadById).toBeCalledWith('thread-123');
    expect(mockCommentRepository.addComment).toBeCalledWith(
      'user-123',
      new CreateComment({
        threadId: useCasePayload.threadId,
        content: useCasePayload.content,
      })
    );
  });
});

const DeleteComment = require('../../../Domains/comments/entities/DeleteComment');
const DeletedComment = require('../../../Domains/comments/entities/DeletedComment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DeleteCommentUseCase = require('../DeleteCommentUseCase');

describe('DeleteCommentUseCase', () => {
  it('should orchestrating the create comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };
    const expectedDeletedComment = new DeletedComment({
      id: 'comment-123',
    });

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.deleteComment = jest
      .fn()
      .mockImplementation(() => Promise.resolve(expectedDeletedComment));
    mockCommentRepository.findCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ userId: 'user-123' }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action
    const deletedComment = await deleteCommentUseCase.execute(
      'user-123',
      useCasePayload
    );

    // Assert
    expect(deletedComment).toStrictEqual(expectedDeletedComment);
    expect(mockCommentRepository.findCommentInThread).toBeCalledWith(
      new DeleteComment({
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      })
    );
    expect(mockCommentRepository.deleteComment).toBeCalledWith(
      'user-123',
      new DeleteComment({
        commentId: useCasePayload.commentId,
        threadId: useCasePayload.threadId,
      })
    );
  });

  it('should throw error when unauthorized user delete comment', async () => {
    // Arrange
    const unauthorizedUserId = 'user-222';
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
    };

    /** creating dependency of use case */
    const mockCommentRepository = new CommentRepository();
    mockCommentRepository.findCommentInThread = jest
      .fn()
      .mockImplementation(() => Promise.resolve({ userId: 'user-123' }));

    /** creating use case instance */
    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
    });

    // Action and Assert
    await expect(
      deleteCommentUseCase.execute(unauthorizedUserId, useCasePayload)
    ).rejects.toThrowError('DELETE_COMMENT_USE_CASE.USER_NOT_AUTHORIZED');
  });
});

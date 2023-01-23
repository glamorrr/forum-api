const DeleteComment = require('../../Domains/comments/entities/DeleteComment');

class DeleteCommentUseCase {
  constructor({ commentRepository }) {
    this._commentRepository = commentRepository;
  }

  async execute(userId, useCasePayload) {
    const { commentId, threadId } = useCasePayload;

    const comment = await this._commentRepository.findCommentInThread({
      commentId,
      threadId,
    });

    if (comment.userId !== userId) {
      throw new Error('DELETE_COMMENT_USE_CASE.USER_NOT_AUTHORIZED');
    }

    const commentToDelete = new DeleteComment(useCasePayload);
    return this._commentRepository.deleteComment(userId, commentToDelete);
  }
}

module.exports = DeleteCommentUseCase;

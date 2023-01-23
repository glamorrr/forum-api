const CreateComment = require('../../Domains/comments/entities/CreateComment');

class CreateCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const { threadId } = useCasePayload;

    await this._threadRepository.findThreadById(threadId);

    const comment = new CreateComment(useCasePayload);
    return this._commentRepository.addComment(userId, comment);
  }
}

module.exports = CreateCommentUseCase;

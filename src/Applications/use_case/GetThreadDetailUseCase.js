const ThreadDetail = require('../../Domains/threads/entities/ThreadDetail');

class GetThreadDetailUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;

    const thread = await this._threadRepository.getThreadWithCreatorById(
      threadId,
    );

    const comments = await this._commentRepository.getCommentsWithCreatorByThreadId(threadId);
    const formattedComments = comments.map((comment) => {
      const formattedComment = { ...comment };
      if (formattedComment.isDelete) {
        formattedComment.content = '**komentar telah dihapus**';
      }
      delete formattedComment.isDelete;
      return formattedComment;
    });

    const result = new ThreadDetail({ ...thread, comments: formattedComments });
    return result;
  }
}

module.exports = GetThreadDetailUseCase;

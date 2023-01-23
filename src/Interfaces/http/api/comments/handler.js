const CreateCommentUseCase = require('../../../../Applications/use_case/CreateCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postCommentHandler = this.postCommentHandler.bind(this);
    this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
  }

  async postCommentHandler(request, h) {
    const createComentUseCase = this._container.getInstance(
      CreateCommentUseCase.name,
    );
    const userId = request.auth.credentials.id;
    const { threadId } = request.params;

    const addedComment = await createComentUseCase.execute(userId, {
      ...request.payload,
      threadId,
    });

    const response = h.response({
      status: 'success',
      data: {
        addedComment,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCommentHandler(request, h) {
    const deleteCommentUseCase = this._container.getInstance(
      DeleteCommentUseCase.name,
    );
    const userId = request.auth.credentials.id;
    const { threadId, commentId } = request.params;

    await deleteCommentUseCase.execute(userId, {
      threadId,
      commentId,
    });

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;

const CreateThreadUseCase = require('../../../../Applications/use_case/CreateThreadUseCase');
const GetThreadDetailUseCase = require('../../../../Applications/use_case/GetThreadDetailUseCase');

class ThreadHandler {
  constructor(container) {
    this._container = container;

    this.postThreadHandler = this.postThreadHandler.bind(this);
    this.getThreadHandler = this.getThreadHandler.bind(this);
  }

  async postThreadHandler(request, h) {
    const createThreadUseCase = this._container.getInstance(
      CreateThreadUseCase.name,
    );
    const userId = request.auth.credentials.id;

    const addedThread = await createThreadUseCase.execute(
      userId,
      request.payload,
    );

    const response = h.response({
      status: 'success',
      data: {
        addedThread,
      },
    });
    response.code(201);
    return response;
  }

  async getThreadHandler(request, h) {
    const getThreadDetailUseCase = this._container.getInstance(
      GetThreadDetailUseCase.name,
    );
    const { threadId } = request.params;
    const thread = await getThreadDetailUseCase.execute({ threadId });

    const response = h.response({
      status: 'success',
      data: {
        thread,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = ThreadHandler;

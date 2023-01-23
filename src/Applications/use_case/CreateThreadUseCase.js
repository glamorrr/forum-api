const CreateThread = require('../../Domains/threads/entities/CreateThread');

class CreateThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const { title, body } = useCasePayload;

    const thread = new CreateThread({
      title,
      content: body,
    });
    return this._threadRepository.addThread(userId, thread);
  }
}

module.exports = CreateThreadUseCase;

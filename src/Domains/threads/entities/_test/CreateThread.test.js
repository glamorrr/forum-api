const CreateThread = require('../CreateThread');

describe('a CreateThread entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payloadWithoutContent = {
      title: 'abc',
    };

    const payloadWithoutTitle = {
      content: 'def',
    };

    // Action and Assert
    expect(() => new CreateThread(payloadWithoutContent)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
    expect(() => new CreateThread(payloadWithoutTitle)).toThrowError(
      'CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      title: 'abc',
      content: 123,
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should throw error when title contains more than 50 character', () => {
    // Arrange
    const payload = {
      title: 'dicodingindonesiadicodingindonesiadicodingindonesiadicoding',
      content: 'abc',
    };

    // Action and Assert
    expect(() => new CreateThread(payload)).toThrowError(
      'CREATE_THREAD.TITLE_LIMIT_CHAR'
    );
  });

  it('should create createThread object correctly', () => {
    // Arrange
    const payload = {
      title: 'dicoding',
      content: 'abcabc',
    };

    // Action
    const { title, content } = new CreateThread(payload);

    // Assert
    expect(title).toEqual(payload.title);
    expect(content).toEqual(payload.content);
  });
});

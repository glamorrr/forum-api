const DeletedComment = require('../DeletedComment');

describe('a DeletedComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {};

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETED_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY'
    );
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
    };

    // Action and Assert
    expect(() => new DeletedComment(payload)).toThrowError(
      'DELETED_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION'
    );
  });

  it('should create deletedComment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
    };

    // Action
    const { id } = new DeletedComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
  });
});

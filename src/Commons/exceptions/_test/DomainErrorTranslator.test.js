const AuthorizationError = require('../AuthorizationError');
const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error correctly', () => {
    // Register user
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena karakter username melebihi batas limit'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat user baru karena username mengandung karakter terlarang'
      )
    );

    // User login
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError('harus mengirimkan username dan password')
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(new InvariantError('username dan password harus string'));

    // Refresh authentication
    expect(
      DomainErrorTranslator.translate(
        new Error('REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'));

    // Delete authentication
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN')
      )
    ).toStrictEqual(new InvariantError('harus mengirimkan token refresh'));
    expect(
      DomainErrorTranslator.translate(
        new Error(
          'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION'
        )
      )
    ).toStrictEqual(new InvariantError('refresh token harus string'));

    // Create thread
    expect(
      DomainErrorTranslator.translate(
        new Error('CREATE_THREAD.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('CREATE_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena tipe data tidak sesuai'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('CREATE_THREAD.TITLE_LIMIT_CHAR')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat thread baru karena karakter title melebihi batas limit'
      )
    );

    // Create comment
    expect(
      DomainErrorTranslator.translate(
        new Error('CREATE_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'
      )
    );
    expect(
      DomainErrorTranslator.translate(
        new Error('CREATE_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION')
      )
    ).toStrictEqual(
      new InvariantError(
        'tidak dapat membuat comment baru karena tipe data tidak sesuai'
      )
    );

    // Delete comment
    expect(
      DomainErrorTranslator.translate(
        new Error('DELETE_COMMENT_USE_CASE.USER_NOT_AUTHORIZED')
      )
    ).toStrictEqual(
      new AuthorizationError('user unauthorized untuk menghapus comment')
    );
  });

  it('should return original error when error message is not needed to translate', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});

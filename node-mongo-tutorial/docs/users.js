const createUser = {
    tags: ['Users'],
    description: 'Create a new use in the system',
    operationId: 'createUser',
    security: [
      {
        bearerAuth: [],
      },
    ],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/createUserBody',
          },
        },
      },
      required: true,
    },
    responses: {
      '201': {
        description: 'User Created',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                code: {
                    type: 'integer'
                },
                message: {
                    type: 'string'
                },
                CreatedUser: {
                    _id: {
                      type: 'string',
                      example: '60564fcb544047cdc3844818',
                    },
                    username: {
                      type: 'string',
                      example: 'John Snow',
                    },
                    email: {
                      type: 'string',
                      example: 'john.snow@email.com',
                    },
                    password: {
                      type: 'string',
                      example: '442893aba778ab321dc151d9b1ad98c64ed56c07f8cbaed',
                    },
                    publicId: {
                        type: 'string'
                    },
                    imageUrl: {
                        type: 'string'
                    },
                    admin: {
                      type: 'boolean',
                      example: 'user',
                    },
                }
              },
            },
          },
        },
      },
      '500': {
        description: 'Internal Server Error',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Internal Server Error',
                },
              },
            },
          },
        },
      },
    },
  };

  export {createUser}
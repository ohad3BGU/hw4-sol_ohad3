import handle from './index';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((payload, secretOrPrivateKey) => 'mocked-token'),
  verify: jest.fn((token, secretOrPublicKey) => ({
    username: 'testuser',
    userId: '123',
    email: 'test@example.com',
    experationTime: 99999999999999999,
  })),
}));

describe('JWT test', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { method: '', body: {}, headers: {} };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST method', () => {
    beforeEach(() => {
      req.method = 'POST';
      req.body = {
        username: 'testuser',
        userId: '123',
        email: 'test@example.com',
      };
    });

    it('should return a 200 status code and set the JWT token in the cookie header', () => {
      handle(req, res);

      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', 'jwt=mocked-token; Path=/; HttpOnly');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe('GET method', () => {
    beforeEach(() => {
      req.method = 'GET';
      req.headers.cookie = 'jwt=mocked-token';
    });

    it('should return a 200 status code and the decoded token payload', () => {
      handle(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        username: 'testuser',
        userId: '123',
        email: 'test@example.com',
      });
    });
  });
});

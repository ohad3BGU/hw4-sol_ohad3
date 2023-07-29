import handle from './signout';

describe('API Route - handle', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = { method: 'DELETE' };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 200 status code and success message when sending a DELETE request', async () => {
    await handle(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'successfully logged out' });
    expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', `jwt=''; Path=/; HttpOnly`);
  });

  it('should return a 405 status code and error message when sending a non-DELETE request', async () => {
    req.method = 'GET';

    await handle(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method Not Allowed' });
    expect(res.setHeader).not.toHaveBeenCalled();
  });
});

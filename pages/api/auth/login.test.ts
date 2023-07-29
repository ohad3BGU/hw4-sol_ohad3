import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';
import handle from './login';

jest.mock('bcrypt');
jest.mock('../../../lib/prisma', () => ({
  user: {
    findFirst: jest.fn(),
  },
}));

describe('Login API tests', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      setHeader: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns error for empty username and password', async () => {
    req.body = {
      username: '',
      password: '',
    };

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required fields' });
  });

  it('returns error for empty username', async () => {
    req.body = {
      username: '',
      password: 'testpassword',
    };

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required fields' });
  });

  it('returns error for empty password', async () => {
    req.body = {
      username: 'testuser',
      password: '',
    };

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required fields' });
  });

  it('returns error for invalid credentials', async () => {
    const findFirstMock = prisma.user.findFirst as jest.Mock;
    findFirstMock.mockResolvedValue(null);

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(findFirstMock).toHaveBeenCalledWith({ where: { username: 'testuser' } });
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
  });

});

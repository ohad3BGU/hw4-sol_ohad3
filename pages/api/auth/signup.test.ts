import handle from './signup';
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

jest.mock('../../../lib/prisma', () => ({
  user: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
}));

describe('Signup API tests', () => {
  let req: Partial<NextApiRequest>;
  let res: Partial<NextApiResponse>;

  beforeEach(() => {
    req = {
      method: 'POST',
      body: {
        username: 'john_doe',
        password: 'password123',
        email: 't@e.st',
        name: 'John Doe',
        image: null,     
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

  it('returns error for missing fields', async () => {
    req.body.email = '';

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'All fields are required' });
  });

  it('returns error for invalid email address', async () => {
    req.body.email = 'invalid-email';

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email address' });
  });

  it('returns error for existing email address', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue({});

    await handle(req as NextApiRequest, res as NextApiResponse);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ error: 'Email address already exists' });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 't@e.st' } });
  });

  it('creates a new user', async () => {
    (prisma.user.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1 });

    await handle(req as NextApiRequest, res as NextApiResponse);

    //this test needs the server to be running
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful' });
    expect(prisma.user.findFirst).toHaveBeenCalledWith({ where: { email: 't@e.st' } });
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        username: 'john_doe',
        password: expect.any(String),
        email: 't@e.st',
        name: 'John Doe',
        image: null,
      },
    });
  });
});

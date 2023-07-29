import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { csrf } from '../../../lib/csrf';

// POST /api/post
// Required fields in body: title
// Optional fields in body: content
const handle = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content, email } = req.body;
  if (req.method === 'POST') {
    const result = await prisma.post.create({
      data: {
        title: title,
        content: content,
        author: { connect: { email: email } },
      },
    });
    res.json(result);
  } else {
    throw new Error(`The HTTP ${req.method} method is not supported at this route.`);
  }
};

export default csrf(handle);

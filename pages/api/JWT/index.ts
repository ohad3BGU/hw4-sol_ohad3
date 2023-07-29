import { NextApiRequest, NextApiResponse } from 'next';
import jwt, { JwtPayload } from 'jsonwebtoken';

const secretKey = 'highly_sophisticated_$3cr3tK3Y';

export default function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { username, userId, email } = req.body;
    const experationDate = new Date();
    experationDate.setDate(experationDate.getDate() + 30);
    const experationTime = experationDate.getTime();
    const payload = { username, userId, email, experationTime };
    const token = jwt.sign(payload, secretKey);
    res.setHeader('Set-Cookie', `jwt=${token}; Path=/; HttpOnly`);
    res.status(200).end();
  } 
  
  else if (req.method === 'GET') {
    const cookieHeader = req.headers.cookie;
    let token = null;
    if (cookieHeader) {
      const cookies = cookieHeader.split(';');
      const targetCookie = cookies.find(cookie => cookie.trim().startsWith('jwt='));
      if (targetCookie) {
        token = targetCookie.split('=')[1];
      }
    }

    if (!token || token == '') {
      res.status(401).json({ message: 'Unauthenticated' });
      return;
    }
    try {
      const decoded = jwt.verify(token, secretKey) as JwtPayload;
      const { username, userId, email, experationTime } = decoded;
      const currentTime = new Date().getTime();
      if (currentTime > experationTime) {
        res.status(302).json({ message: 'Authentication expired' });
        return;
      }
      res.status(200).json({ username, userId, email });
      return;
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  else {
    res.status(405).end();
  }
}

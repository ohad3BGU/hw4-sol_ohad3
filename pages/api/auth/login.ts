import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import prisma from '../../../lib/prisma';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { username, password } = req.body;
  if (username === '' || password === '') {
    res.status(401).json({ error: 'Username and password are required fields' });
    return;
  }
  try {
    const user = await prisma.user.findFirst({ where: { username } });
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    let hashedPassword;
    // Compare the provided password with the hashed password stored in the database
    if (user.password){
      hashedPassword = await bcrypt.compare(password, user.password);
    }
    else{
      hashedPassword = false;
    }

    if (!hashedPassword) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    const JWTRoute = 'http://localhost:3000/api/JWT';
    const userId = user.id
    const email = user.email;
    const response = await fetch(JWTRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, userId, email }),
      });
  
      if (!response.ok) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
    res.setHeader('Set-Cookie', `${response.headers.get('Set-Cookie')}; Path=/; HttpOnly`);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

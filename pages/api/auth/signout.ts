import { NextApiRequest, NextApiResponse } from 'next';

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try{  //just clearing the cookie to signout
    res.setHeader('Set-Cookie', `jwt=''; Path=/; HttpOnly`);
    res.status(200).json({ message : 'successfully logged out' });
    return;
    }
   catch (error) {
    console.error('That is emberassing, but there is an error: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
}

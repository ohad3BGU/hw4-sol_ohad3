import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dyr8z5bci",
  api_key: "663376792966651",
  api_secret: "-sio-diVpS1f6lRS7FCyMwtM2uA"
});
// POST /api/auth/signup
// Required fields in body: username, password, email, name
// Optional fields in body: photo (to implement client side)

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const { username, password, email, name, imageData = '' } = req.body;
  if (username === '' || password === '' || email === ''|| name === '') {
    res.status(401).json({ error: 'All fields are required' });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(401).json({ error: 'Invalid email address' });
    return;
  }

  try {
    
    const existingEmail = await prisma.user.findFirst({ where: { email } });
    if (existingEmail) {
      // If a user with the same email already exists, return an error response
      res.status(409).json({ error: 'Email address already exists' });
      return;
    }

    const existingUsername = await prisma.user.findFirst({ where: { username } });
    if (existingUsername) {
      // If a user with the same username already exists, return an error response
      res.status(409).json({ error: 'Username already exists' });
      return;
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    let imageUrl = null;
    try{
      if (imageData !== '') {
        const cloudinaryUpload = await cloudinary.uploader.upload(imageData, {
          resource_type: "image",
          public_id: username,
        });
        imageUrl = cloudinaryUpload.secure_url;
        }
    }
    catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
    const result = await prisma.user.create({
      data: {
        username : username,
        password : hashedPassword,
        email : email,
        name : name,
        image : imageUrl || null,
      },
    });


    const userId = result.id
    const JWTRoute = 'http://localhost:3000/api/JWT';
    const response = await fetch(JWTRoute, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            username,
            userId,
            email }),
      });
  
      if (!response.ok) {
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
  
    res.setHeader('Set-Cookie', `${response.headers.get('Set-Cookie')}; Path=/; SameSite=Strict; HttpOnly`);
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}


import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../../lib/prisma';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: "dyr8z5bci",
  api_key: "663376792966651",
  api_secret: "-sio-diVpS1f6lRS7FCyMwtM2uA"
});

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  const { userId, imageData, username } = req.body;

  if (req.method === 'POST') {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: Number(userId),
        },
        select: {
          id : true,
          name: true,
          username: true,
          email: true,
          image: true,
        },
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json(user);
      res.status(200);
    } catch (error) {
      console.error('Error retrieving user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {

    let imageUrl = null;
    try {
      if (imageData !== '') {
        const cloudinaryUpload = await cloudinary.uploader.upload(imageData, {
          resource_type: "image",
          public_id: username,
        });
        imageUrl = cloudinaryUpload.secure_url;
      }

      await prisma.user.update({
        where: {
          id: Number(userId),
        },
        data: {
          image: imageUrl,
        },
      });

      res.status(200).json({ message: 'User profile updated successfully' });
    } catch (error) {
      console.error('Error updating user profile:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}

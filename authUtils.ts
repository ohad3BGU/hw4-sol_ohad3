import type { NextApiRequest, NextApiResponse } from 'next'

const JWTRoute = 'http://localhost:3000/api/JWT';

export async function getIsAuthenticated() {
    const response = await fetch(JWTRoute, {
        method: 'GET',
      });    
    if (response.ok){
        return true;
    }
    else{
        return false;
    }
}

export async function getIsAuthenticatedServerSide(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.jwt;
  const response = await fetch(JWTRoute, {
    method: 'GET',
    headers: {
      cookie: `jwt=${token}`, 
    },
  });

  if (response.ok) {
    return true;
  } else {
    return false;
  }
}


export async function getEmail() {
    try {
      const response = await fetch(JWTRoute, {
        method: 'GET',
      });
      const data = await response.json();
      const { username, userId, email } = data;
      return email;
    } catch (error) {
      console.error('Error occurred while getting email address:', error);
      throw error; 
    }
  }
  
  export async function getEmailServerSide(req: NextApiRequest, res: NextApiResponse) {
    try {
      const token = req.cookies.jwt;
      const response = await fetch(JWTRoute, {
        method: 'GET',
        headers: {
          cookie: `jwt=${token}`, 
        },
      });
      const data = await response.json();
      const { username, userId, email } = data;
      return email;
    } catch (error) {
      console.error('Error occurred while getting email address:', error);
      throw error; 
    }
  }

  export async function getUsername() {
    try {
      const response = await fetch(JWTRoute, {
        method: 'GET',
      });
      const data = await response.json();
      const { username, userId, email } = data;
      return username;
    } catch (error) {
      console.error('Error occurred while getting email address:', error);
      throw error; 
    }
  }

export async function getUserId(){
    try {
    const response = await fetch(JWTRoute, {
      method: 'GET',
    });
    const data = await response.json();
    const { username, userId, email } = data;
    return userId;
  } catch (error) {
    console.error('Error occurred while getting email address:', error);
    throw error; 
  }
}

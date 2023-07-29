import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { getUserId, getIsAuthenticated } from '../authUtils';

export default function Profile() {
  const [currentUser, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await getIsAuthenticated();
        setIsAuthenticated(response);
      } catch (error) {
        console.error('Error occurred while validating authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userIdentifier = await getUserId();
        const response = await fetch('/api/profile', {
          method: 'POST',
          body: JSON.stringify({ userId: userIdentifier }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPhoto = e.target.files && e.target.files[0];
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Image = reader.result as string;
        try {
          const response = await fetch('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({
              userId: currentUser.id,
              imageData: base64Image,
              username: currentUser.username,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
          if (response.ok) {
            const updatedUser = { ...currentUser, image: base64Image };
            setUser(updatedUser);
          } else {
            console.error('Error updating user profile:', response.statusText);
          }
        } catch (error) {
          console.error('Error updating user profile:', error);
        }
      };
      reader.readAsDataURL(selectedPhoto);
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <h1>My Profile</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  } else {
    return (
      <Layout>
        <div>
          <h1>My Profile</h1>
          {currentUser ? (
            <div>
              <p>Name: {currentUser.name}</p>
              <p>Username: {currentUser.username}</p>
              <p>Email: {currentUser.email}</p>
              <div>
                <a> Change profile image </a>
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </div>
              <div className="image-container">
                {currentUser.image && (
                  <img
                    src={currentUser.image}
                    alt="Profile Image"
                    style={{ width: '200px', height: 'auto' }}
                  />
                )}
              </div>
            </div>
          ) : (
            <p>Loading user profile...</p>
          )}
        </div>
        <style jsx>{`
                .image-container {
                  display: flex;
                  align-items: flex-start;
                  margin-left: 40rem;
                  margin-top: -6rem;
                }
                `}</style>
      </Layout>
    );
  }
}

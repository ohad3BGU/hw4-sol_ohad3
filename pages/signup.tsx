import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const SignUp: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');
  const [imageData, setImage] = useState('');


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '' || password  === '' ||  email  === '' || name  === '') {
      const error = "All fields must not be empty";
      setErrorMessage(error);
    }
    else {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
            email,
            name,
            imageData,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          router.push('/');
        } else {
          const errorData = await response.json();
          const errorMessage = errorData.error;
          setErrorMessage(errorMessage);
        }
      } catch (error) {
        console.error('Sign up error:', error);
      }
      setUsername('');
      setPassword('');
      setEmail('');
      setName('');
    }
  };

  const handleSignInClick = () => {
    router.push('/login');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedPhoto = e.target.files && e.target.files[0];
    if (selectedPhoto) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        setImage(base64Image)
      };
      reader.readAsDataURL(selectedPhoto);
    }
  };

  return (
    <Layout>
      <div className="container">
        <h2>Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Photo:</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>
          <button type="submit">Sign Up</button>
        </form>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="signin-link">
          <p>Already a member? <button onClick={handleSignInClick}>Log In</button></p>
        </div>
        <style jsx>{`
          .error-message {
          color: red;
          }

          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 50px;
          }

          h2 {
            text-align: center;
          }

          .form-group {
            margin-bottom: 10px;
          }

          label {
            display: block;
            margin-bottom: 5px;
          }

          input[type='text'],
          input[type='password'],
          input[type='email'] {
            width: 100%;
            padding: 10px;
            font-size: 16px;
          }

          button {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
          }

          .signin-link {
            margin-top: 10px;
            text-align: center;
          }
        `}</style>
      </div>
     </Layout>
     );
};

export default SignUp;

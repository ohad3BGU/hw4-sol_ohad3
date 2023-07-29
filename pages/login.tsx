import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

const LogIn: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');


  const handleLogIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username === '' || password === ''){
      const error = "All fields must not be empty";
      setErrorMessage(error);
    }
    else {
    
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            password,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          router.push('/');
        } else {
          const errorData = await response.json();
          let error = errorData.error;
          setErrorMessage(error);
        }
      } catch (error) {
        console.error('log in error:', error);
      }

      // Reset form fields
      setUsername('');
      setPassword('');
    }
  };

  const handleSignUpClick = () => {
    router.push('/signup');
  };

  return (
    <Layout>
    <div className="container">
      <h2>Log In</h2>
      <form onSubmit={handleLogIn}>
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
        <button type="submit">Log In</button>
      </form>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="signup-link">
        <p>Not a member? <button> <a onClick={handleSignUpClick}>Sign up</a></button></p> 
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
        input[type='password'] {
          width: 100%;
          padding: 10px;
          font-size: 16px;
        }

        button {
            border: 1px solid black;
            padding: 0.5rem 1rem;
            border-radius: 3px;
            
        }

        .signup-link {
          margin-top: 10px;
          text-align: center;
        }


      `}</style>
    </div>
    </Layout>
  );
};

export default LogIn;

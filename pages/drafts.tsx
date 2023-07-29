import React from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import Post, { PostProps } from "../components/Post";
import prisma from '../lib/prisma'
import { getIsAuthenticated, getIsAuthenticatedServerSide, getEmailServerSide } from '../authUtils';
import { useEffect, useState } from "react";
 

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  let isAuthenticated = false;
  let email = 'r2@r2.r2';

  try {
    const response = await getIsAuthenticatedServerSide(req, res);
    if (response) {
      isAuthenticated = true;
      email = await getEmailServerSide(req, res);
    } else {
      isAuthenticated = false;
    }
  } catch (error) {
    console.error('Error occurred while validating authentication:', error);
    isAuthenticated = false;
  }

  if (!isAuthenticated) {
    res.statusCode = 403;
    return { props: { drafts: [] } };
  }

  const drafts = await prisma.post.findMany({
    where: {
      author: { email },
      published: false,
    },
    include: {
      author: {
        select: { name: true, image : true },
      },
    },
  });

  return {
    props: { drafts },
  };
};


type Props = {
  drafts: PostProps[];
};

const Drafts: React.FC<Props> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await getIsAuthenticated();
        if (response) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error occurred while validating authentication:', error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);
  if (!isAuthenticated) {
    return (
      <Layout>
        <h1>My Drafts</h1>
        <div>You need to be authenticated to view this page.</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="page">
        <h1>My Drafts</h1>
        <main>
          {props.drafts.map((post) => (
            <div key={post.id} className="post">
              <Post post={post} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  );
};

export default Drafts;

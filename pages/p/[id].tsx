import React from "react";
import { GetServerSideProps } from "next";
import ReactMarkdown from "react-markdown";
import Layout from "../../components/Layout";
import Router from "next/router";
import { PostProps } from "../../components/Post";
import prisma from '../../lib/prisma'
import { getIsAuthenticated, getEmail } from '../../authUtils';
import { useState, useEffect } from "react";


export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: Number(params?.id) || -1,
    },
    include: {
      author: {
        select: { name: true, email: true, image: true },
      },
    },
  });
  return {
    props: post ?? { author: { name: "Me" } }
  };
};

async function publishPost(id: number): Promise<void> {
  await fetch(`/api/publish/${id}`, {
    method: "PUT",
  });
  await Router.push("/")
}

async function deletePost(id: number): Promise<void> {
  await fetch(`/api/post/${id}`, {
    method: "DELETE",
  });
  await Router.push("/")
}

const Post: React.FC<PostProps> = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await getIsAuthenticated();
        if (response) {
          setIsAuthenticated(true);
          const emailAddress = await getEmail();
          setEmail(emailAddress);
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
  const userHasValidSession = Boolean(isAuthenticated);
  const postBelongsToUser = email === props.author?.email;
  const profileImage = Boolean(props.author?.image)
  let title = props.title;
  if (!props.published) {
    title = `${title} (Draft)`;
  }

  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {props?.author?.name || "Unknown author"}</p>
        <ReactMarkdown children={props.content} />
        {profileImage && (
          <div className="image-container">
            <img src={props.author?.image} alt="Profile Image" width={200} height={200} />
          </div>
        )}
        {!props.published && userHasValidSession && postBelongsToUser && (
          <button onClick={() => publishPost(props.id)}>Publish</button>
        )}
        {userHasValidSession && postBelongsToUser && (
          <button onClick={() => deletePost(props.id)}>Delete</button>
        )}
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 2rem;
        }

        .image-container {
          display: flex;
          justify-content: flex-end;
          margin-top: -6rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  );
};

export default Post;

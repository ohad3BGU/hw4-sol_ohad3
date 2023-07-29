import React from "react";
import Router from "next/router";
import ReactMarkdown from "react-markdown";

export type PostProps = {
  id: number;
  title: string;
  author: {
    name: string;
    email: string;
    image: string;
  } | null;
  content: string;
  published: boolean;
};

const Post: React.FC<{ post: PostProps }> = ({ post }) => {
  const authorName = post.author ? post.author.name : "Unknown author";
  return (
    <div onClick={() => Router.push("/p/[id]", `/p/${post.id}`)}>
      <h2>{post.title}</h2>
      <small>By {authorName}</small>
      <ReactMarkdown children={post.content} />
      {post.author?.image && (
        <div className="image-container">
          <img src={post.author.image} alt="Profile Image" width={100} height={100} />
        </div>
      )}
      <style jsx>{`
        div {
          color: inherit;
          padding: 2rem;
        }
        
        .image-container {
          display: flex;
          justify-content: flex-end;
          margin-top: -6rem;
        }
      `}</style>
    </div>
  );
};

export default Post;

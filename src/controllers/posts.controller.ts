import { Request, Response } from "express";
import Post from "../models/posts.model.js";

const post = Post.getInstance();

export const getPosts = async (req: Request, res: Response) => {
  const results = await post.getPosts();

  const posts = results.map((result) => {
    return {
      title: result.title,
      summary: result.summary,
      status: result.current_status,
      slug_url: result.slug_url,
      author: {
        username: result.username,
        full_name: result.full_name,
        avatar_url: result.avatar_url,
      },
      modified_at: result.modified_at,
    };
  });
  res.json({
    success: true,
    message: `${posts.length} posts retrieved successfully`,
    posts: posts,
  });
};

export const getPost = async (req: Request, res: Response) => {
    const { slug_url } = req.params;
    const result = await post.getPost(slug_url);
    res.json({
      success: true,
      message: "post retrieved successfully",
      post: {
        title: result.title,
        meta_title: result.meta_title,
        summary: result.summary,
        body: result.body,
        status: result.current_status,
        banner_url: result.banner_url,
        slug_url: result.slug_url,
        author: {
          username: result.username,
          full_name: result.full_name,
          avatar_url: result.avatar_url,
        },
        modified_at: result.modified_at,
      },
    });
  };

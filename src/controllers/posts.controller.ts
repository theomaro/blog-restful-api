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

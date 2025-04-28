export const createPostQuery = `
  INSERT INTO posts (blog_id, owner_id, title, content)
  VALUES ($1, $2, $3, $4)
  RETURNING *;
`;

export const getAllPostsQuery = `
  SELECT * FROM posts
  WHERE blog_id = $1
`;

export const getPostByIdAndIncrementViewQuery = `
  WITH updated AS (
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = $1
    RETURNING *
  )
  SELECT * FROM updated;
`;

export const updatePostQuery = `
  UPDATE posts
  SET title = $1,
      content = $2
  WHERE id = $3 AND owner_id = $4
  RETURNING *;
`;

export const deletePostQuery = `
  DELETE FROM posts
  WHERE id = $1 AND owner_id = $2
  RETURNING *;
`;

export const getSortedPostsByDateQuery = `
  SELECT *
  FROM posts
  WHERE blog_id = $1
  ORDER BY created_at DESC;
`;

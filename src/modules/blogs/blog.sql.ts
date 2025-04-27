export const createBlogQuery = `
    INSERT INTO blogs
        (title, description, owner_id)
    VALUES
        ($1, $2, $3)
    RETURNING *
`;

export const getMyBlogsQuery = `
    SELECT * FROM blogs
    WHERE owner_id = $1
    ORDER BY created_at DESC
`;

export const getMyJoinedBlogsQuery = `
    SELECT b.*
    FROM blogs AS b
    INNER JOIN blog_members AS bm ON bm.blog_id = b.id
    WHERE bm.user_id = $1
    ORDER BY bm.joined_at DESC
`;

export const getBlogInfoQuery = `
    SELECT * FROM blogs
    WHERE id = $1
`;

export const updateBlogQuery = `
  UPDATE blogs
  SET title = $1,
      description = $2
  WHERE id = $3 AND owner_id = $4
  RETURNING *;
`;

export const deleteBlogQuery = `
  DELETE FROM blogs
  WHERE id = $1 AND owner_id = $2
  RETURNING *;
`;

export const searchBlogsQuery = `
    SELECT * FROM blogs
    WHERE title ILIKE '%' || $1 || '%'
    ORDER BY created_at DESC
`;

export const joinBlogQuery = `
  INSERT INTO blog_members (blog_id, user_id)
  VALUES ($1, $2)
  RETURNING *;
`;

export const leaveBlogQuery = `
  DELETE FROM blog_members
  WHERE blog_id = $1 AND user_id = $2
  RETURNING *;
`;

export const getBlogUsersQuery = `
    SELECT u.id, u.name, u.username, u.email
    FROM users AS u
    INNER JOIN blog_members AS bm ON bm.user_id = u.id
    WHERE bm.blog_id = $1
    ORDER BY u.name ASC
`;

export const checkIsMemberQuery = `
  SELECT id FROM blog_members
  WHERE blog_id = $1 AND user_id = $2;
`;

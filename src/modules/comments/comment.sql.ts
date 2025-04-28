export const createCommentQuery = `
    INSERT INTO comments (post_id, user_id, content)
    VALUES ($1, $2, $3)
    RETURNING *;
`;

export const getCommentsByPostIdQuery = `
    SELECT * FROM comments
    WHERE post_id = $1
    ORDER BY created_at DESC;
`;

export const updateCommentQuery = `
    UPDATE comments
    SET content = $1
    WHERE id = $2 AND user_id = $3
    RETURNING *;
`;

export const deleteCommentQuery = `
    DELETE FROM comments
    WHERE id = $1 AND user_id = $2
    RETURNING *;
`;

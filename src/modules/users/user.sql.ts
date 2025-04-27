export const getMyProfileQuery = `
    SELECT id, name, username, email, created_at
    FROM users
    WHERE id = $1
`;

export const registerQuery = `
    INSERT INTO users
        (name, username, email, password)
    VALUES
        ($1, $2, $3, $4)
    RETURNING *;
`;

export const findUserByEmail = `
    SELECT *
    FROM users
    WHERE email = $1
`;

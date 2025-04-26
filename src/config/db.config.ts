import Client from "pg";
import dotenv from "dotenv";
dotenv.config();

const client = new Client.Pool({
  user: process.env.PSQL_USER,
  password: process.env.PSQL_PASSWORD,
  host: process.env.PSQL_HOST,
  port: Number(process.env.PSQL_PORT),
  database: process.env.PROJECT_DATABASE,
});

client
  .connect()
  .then(() => {
    console.log("✅ Connected to PostgreSQL");
  })
  .catch((err) => {
    console.log("❌ Error connecting to database:", err.message);
    process.exit(1);
  });

export default client;

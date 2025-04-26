import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import client from "./config/db.config.js";

client.connect();

const PORT = process.env.PORT as string;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

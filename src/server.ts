import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const PORT = process.env.PORT as string;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});

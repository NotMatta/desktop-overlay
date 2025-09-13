import express from 'express';
import cors from 'cors';
import router from "./routes/index.ts";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use("/api",router);

app.get('/', (_req, res) => {
  res.json({ message: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

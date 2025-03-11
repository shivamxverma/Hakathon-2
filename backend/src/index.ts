import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();
const prisma = new PrismaClient();

app.use(cors({
  origin: 'http://localhost:3001', 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.post('/signin', async (req: any, res: any) => {
  try {
    const { email, name, password } = req.body;
    const userData = await prisma.user.create({
      data: { email, name, password }
    });
    res.cookie('userId', userData.id, { httpOnly: true });
    return res.json({ msg: "You Successfully Signed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.post('/login', async (req: any, res: any) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ msg: "User not found" });
    if (user.password !== password) return res.status(401).json({ msg: "Invalid password" });
    res.cookie('userId', user.id, { httpOnly: true });
    return res.json({ msg: "Logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});

app.get('/logout', (req: any, res: any) => {
  res.clearCookie('userId');
  return res.json({ msg: "Logged out successfully" });
});

app.get('/user/posts', async (req: any, res: any) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ msg: "Unauthorized: No user ID found in cookies" });
  try {
    const posts = await prisma.post.findMany({ where: { authorId: userId } });
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error in Getting Data" });
  }
});

app.post('/user/posts', async (req: any, res: any) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ msg: "Unauthorized: No user ID found in cookies" });
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ msg: "Title and content are required" });
    const newPost = await prisma.post.create({
      data: { title, content, authorId: userId }
    });
    return res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Error in posting the post" });
  }
});

app.listen(3000, () => {
  console.log('Server is now started');
});
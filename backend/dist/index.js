"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password } = req.body;
        const userData = yield prisma.user.create({
            data: { email, name, password }
        });
        res.cookie('userId', userData.id, { httpOnly: true });
        return res.json({ msg: "You Successfully Signed" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}));
app.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.user.findUnique({ where: { email } });
        if (!user)
            return res.status(404).json({ msg: "User not found" });
        if (user.password !== password)
            return res.status(401).json({ msg: "Invalid password" });
        res.cookie('userId', user.id, { httpOnly: true });
        return res.json({ msg: "Logged in successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}));
app.get('/logout', (req, res) => {
    res.clearCookie('userId');
    return res.json({ msg: "Logged out successfully" });
});
app.get('/user/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if (!userId)
        return res.status(401).json({ msg: "Unauthorized: No user ID found in cookies" });
    try {
        const posts = yield prisma.post.findMany({ where: { authorId: userId } });
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error in Getting Data" });
    }
}));
app.post('/user/posts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.cookies.userId;
    if (!userId)
        return res.status(401).json({ msg: "Unauthorized: No user ID found in cookies" });
    try {
        const { title, content } = req.body;
        if (!title || !content)
            return res.status(400).json({ msg: "Title and content are required" });
        const newPost = yield prisma.post.create({
            data: { title, content, authorId: userId }
        });
        return res.status(201).json(newPost);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ msg: "Error in posting the post" });
    }
}));
app.listen(3000, () => {
    console.log('Server is now started');
});

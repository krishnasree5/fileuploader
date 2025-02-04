import { Router } from "express";
import { home, uploadGet, uploadPost } from "../controllers/controllers.js";

const app = Router();

app.get("/home", home);

app.get("/upload", uploadGet);

app.post("/upload", uploadPost);

export default app;

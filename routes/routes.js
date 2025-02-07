import { Router } from "express";
import {
  createGet,
  createPost,
  home,
  uploadGet,
  uploadPost,
  deleteGet,
  editGet,
  editPost,
} from "../controllers/controllers.js";

const app = Router();

app.get("/home", home);

app.get("/create", createGet);
app.post("/create", createPost);

app.get("/edit/folder/:folderid", editGet);
app.post("/edit/folder/:folderid", editPost);

app.get("/delete/folder/:folderid", deleteGet);

app.get("/upload", uploadGet);
app.post("/upload", uploadPost);

export default app;

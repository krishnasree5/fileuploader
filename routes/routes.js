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
  loginGet,
  loginPost,
  signupGet,
  signupPost,
  logout,
  folderFilesGet,
  deleteFileGet,
  renameFileGet,
  renameFilePost,
  moveFileGet,
  moveFilePost,
  downloadFileGet,
} from "../controllers/controllers.js";
import { requireAuth, redirectIfAuthenticated } from "../middleware/auth.js";

const app = Router();

// auth routes
app.get("/", redirectIfAuthenticated, (req, res) => res.redirect("/login"));
app.get("/login", redirectIfAuthenticated, loginGet);
app.post("/login", redirectIfAuthenticated, loginPost);
app.get("/signup", redirectIfAuthenticated, signupGet);
app.post("/signup", redirectIfAuthenticated, signupPost);
app.get("/logout", requireAuth, logout);

// protected routes
app.get("/home", requireAuth, home);

app.get("/create", requireAuth, createGet);
app.post("/create", requireAuth, createPost);

app.get("/edit/folder/:folderid", requireAuth, editGet);
app.post("/edit/folder/:folderid", requireAuth, editPost);

app.get("/delete/folder/:folderid", requireAuth, deleteGet);

app.get("/upload", requireAuth, uploadGet);
app.post("/upload", requireAuth, uploadPost);

app.get("/folder/:folderid", requireAuth, folderFilesGet);

app.get("/delete/file/:fileid", requireAuth, deleteFileGet);
app.get("/rename/file/:fileid", requireAuth, renameFileGet);
app.post("/rename/file/:fileid", requireAuth, renameFilePost);

app.get("/move/file/:fileid", requireAuth, moveFileGet);
app.post("/move/file/:fileid", requireAuth, moveFilePost);

app.get("/download/file/:fileid", requireAuth, downloadFileGet);

export default app;

import multer from "multer";
import {
  getAllFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
} from "../prisma/queries.js";
const upload = multer({ dest: "./uploads/" });

export const home = async (req, res) => {
  const folders = await getAllFolders(2);
  // console.log(folders);

  res.render("home", { folders: folders });
};

export const createGet = async (req, res) => {
  res.render("createFolder");
};

export const createPost = async (req, res) => {
  await createFolder(req.body.foldername, 2);
  res.redirect("/home");
};

export const editGet = async (req, res) => {
  const folderId = parseInt(req.params.folderid);
  const folder = await getFolder(folderId);
  res.render("editFolder", { folder: folder });
};

export const editPost = async (req, res) => {
  const folderName = req.body.foldername;
  const folderId = parseInt(req.params.folderid);
  await updateFolder(folderId, folderName);
  res.redirect("/home");
};

export const deleteGet = async (req, res) => {
  const folderId = parseInt(req.params.folderid);
  // console.log(folderId);

  await deleteFolder(folderId);
  res.redirect("/home");
};

export const uploadGet = (req, res) => {
  res.render("uploadFile");
};

export const uploadPost = [
  upload.array("file"),
  (req, res) => {
    console.log(req.files);
    res.redirect("/home");
  },
];

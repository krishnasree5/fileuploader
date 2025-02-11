import multer, { memoryStorage } from "multer";
import { uploadFile } from "../supabase/supabase.js";
import {
  getAllFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  uploadFile as uploadFilePrisma,
} from "../prisma/queries.js";
const upload = multer({ storage: memoryStorage() });

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

export const uploadGet = async (req, res) => {
  const folders = await getAllFolders(2);
  // console.log(folders);
  res.render("uploadFile", { folders: folders });
};

export const uploadPost = [
  upload.single("file"),
  async (req, res) => {
    console.log(req.body);
    // console.log(req.file);

    try {
      if (!req.file || req.file.length == 0) {
        return res.status(404).send("No file uploaded");
      }
      const userId = String(2); //req.user.id
      const fileName = req.file.originalname;
      const folder = JSON.parse(req.body.folder);
      const folderId = folder.id;
      const folderName = folder.name;
      const uploadPath = `${userId}/${folderName}/${fileName}`;
      const file = req.file.buffer;

      const { data, error } = await uploadFile(uploadPath, file);

      try {
        await uploadFilePrisma(fileName, folderId, uploadPath);
      } catch (error) {
        console.error("Database error:", error);
        throw new Error("Failed to save file metadata to database");
      }

      if (error) {
        console.error("Supabase upload error: ", error);
        return res.status(500).send("File upload failed");
      }

      await res.redirect("/home");
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).send("Server error during file upload");
    }
  },
];

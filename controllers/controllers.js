import multer, { memoryStorage } from "multer";
import {
  uploadFile,
  signUp,
  signIn,
  signOut,
  getUser,
} from "../supabase/supabase.js";
import {
  getAllFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  uploadFile as uploadFilePrisma,
  createUser,
  deleteFile,
  updateFile,
} from "../prisma/queries.js";
const upload = multer({ storage: memoryStorage() });

// Auth Controllers
export const loginGet = (req, res) => {
  res.render("login", { error: null });
};

export const loginPost = async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await signIn(email, password);

    if (error) {
      return res.render("login", { error: error.message });
    }

    res.redirect("/home");
  } catch (error) {
    res.render("login", { error: "An error occurred during login" });
  }
};

export const signupGet = (req, res) => {
  res.render("signup", { error: null });
};

export const signupPost = async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;

  try {
    // Create user in Supabase
    const { data: authData, error: authError } = await signUp(email, password, {
      firstName,
      lastName,
      username,
    });

    if (authError) {
      return res.render("signup", { error: authError.message });
    }

    // Create user in Prisma database using Supabase user ID
    await createUser({
      id: authData.user.id, // Use Supabase user ID
      firstName,
      lastName,
      username,
      email,
      password, // Note: In a real app, you should hash this password
    });

    res.redirect("/login");
  } catch (error) {
    console.error("Signup error:", error);
    res.render("signup", { error: "An error occurred during signup" });
  }
};

export const logout = async (req, res) => {
  await signOut();
  res.redirect("/login");
};

// Protected Controllers
export const home = async (req, res) => {
  try {
    console.log("Home controller: Getting user...");
    const { user, error: userError } = await getUser();

    if (userError) {
      console.error("Error getting user:", userError);
      return res.redirect("/login");
    }

    if (!user) {
      console.error("No user found");
      return res.redirect("/login");
    }

    console.log("Home controller: User found, getting folders...");
    const folders = await getAllFolders(user.id);
    console.log("Home controller: Folders retrieved, rendering...");
    res.render("home", { folders: folders });
  } catch (error) {
    console.error("Home controller error:", error);
    res.redirect("/login");
  }
};

export const createGet = (req, res) => {
  res.render("createFolder");
};

export const createPost = async (req, res) => {
  try {
    const { user } = await getUser();
    await createFolder(req.body.foldername, user.id);
    res.redirect("/home");
  } catch (error) {
    res.redirect("/login");
  }
};

export const editGet = async (req, res) => {
  try {
    const folderId = parseInt(req.params.folderid);
    const folder = await getFolder(folderId);
    res.render("editFolder", { folder: folder });
  } catch (error) {
    res.redirect("/login");
  }
};

export const editPost = async (req, res) => {
  try {
    const folderName = req.body.foldername;
    const folderId = parseInt(req.params.folderid);
    await updateFolder(folderId, folderName);
    res.redirect("/home");
  } catch (error) {
    res.redirect("/login");
  }
};

export const deleteGet = async (req, res) => {
  try {
    const folderId = parseInt(req.params.folderid);
    await deleteFolder(folderId);
    res.redirect("/home");
  } catch (error) {
    res.redirect("/login");
  }
};

export const uploadGet = async (req, res) => {
  try {
    const { user } = await getUser();
    const folders = await getAllFolders(user.id);
    res.render("uploadFile", { folders: folders });
  } catch (error) {
    res.redirect("/login");
  }
};

export const uploadPost = [
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file || req.file.length == 0) {
        return res.status(404).send("No file uploaded");
      }

      const { user } = await getUser();
      const folder = JSON.parse(req.body.folder);
      const folderId = folder.id;

      // Create file record first to get the file ID
      const fileRecord = await uploadFilePrisma(
        req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_"),
        folderId,
        "" // URL will be updated after upload
      );

      // Use IDs in the storage path
      const uploadPath = `${user.id}/${folderId}/${fileRecord.id}`;
      const file = req.file.buffer;

      const { data, error } = await uploadFile(uploadPath, file);

      if (error) {
        console.error("Supabase upload error: ", error);
        // Clean up the file record if upload fails
        await deleteFile(fileRecord.id);
        return res.status(500).send("File upload failed");
      }

      // Update the file record with the correct URL
      await updateFile(fileRecord.id, uploadPath);

      res.redirect("/home");
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).send("Server error during file upload");
    }
  },
];

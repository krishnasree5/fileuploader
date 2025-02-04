import multer from "multer";
const upload = multer({ dest: "./uploads/" });

export const home = (req, res) => {
  res.render("home");
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

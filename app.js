import express from "express";
import index from "./routes/routes.js";

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(index);

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});

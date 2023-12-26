//packages
const express = require("express");
const mongoose = require("mongoose");

//other files
const authRouter = require("./routers/auth");
const authJwt = require("./middlewares/jwt");

//init
const app = express();
const port = process.env.PORT;
const url = process.env.API_URL;

//middlewares
app.use(express.json());
// app.use(authJwt);

//actions
app.use(`${url}/auth`, authRouter);
app.use("/", (req, res) => {
  res.send("hi, from ecommerce");
});

//connection
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("mongoose connection successfully");
  })
  .catch((err) => {
    console.log(err);
  });
app.listen(port, () => {
  console.log(`servr is listen on http://localhost:${port}`);
});

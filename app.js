const express = require("express");
const gameRoute = require("./routes/game");
const path = require("path");
const app = express();
app.listen(3000, () => {
  console.log("Server listining on http://localhost:3000");
});
app.use(express.static(path.join(__dirname, "public")));

gameRoute(app);

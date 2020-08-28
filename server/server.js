// Configure ExpressJS
const express = require("express");
const app = express();
exports.app = app;

// Route: "/"
app.get("/", (req, res) => {
  return res.sendFile(require("path").join(__dirname + "/pages/index.html"));
});

// Route: "/invite"
app.get("/invite", (req, res) => {
  return res.redirect(
    `https://discord.com/oauth2/authorize?client_id=${process.env.CLIENT_ID}&scope=bot`
  );
});

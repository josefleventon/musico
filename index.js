require("dotenv").config(); // Configure dotenv

// Configure DiscordJS
const Discord = require("discord.js");
const client = new Discord.Client();
const prefix = process.env.BOT_PREFIX;

// Configure ExpressJS server
const { app } = require("./server/server");
const PORT = process.env.PORT || 3450;

// Configure filestack
const fs = require("fs");
const filestack = require("filestack-js");
const filestackClient = filestack.init(process.env.FILESTACK_KEY);

// Import music
const scribble = require("scribbletune");
const synth = require("synth-js");

// Import commands
const { chords, notes, prog } = require("./commands");

// On message...
client.on("message", (message) => {
  if (message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(/ +/g); // Separate arguments
  const command = args.shift().toLowerCase(); // Separate command (includes prefix)

  // Chords command
  if (command.replace(prefix, "") === "chords")
    return chords(args, message, filestackClient);

  // Notes command
  if (command.replace(prefix, "") === "notes")
    return notes(args, message, filestackClient);

  // Prog command
  if (command.replace(prefix, "") === "prog")
    return prog(args, message, filestackClient);
});

// Log in bot
client.login(process.env.BOT_TOKEN);

// When bot is ready...
client.on("ready", () => {
  console.log(`Bot logged in as ${client.user.tag}`); // Log user tag to console
});

// When server is ready...
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`); // Log port to console
});

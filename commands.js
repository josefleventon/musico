// Import music
const scribble = require("scribbletune");
const synth = require("synth-js");

// Import filesystem
const fs = require("fs");

exports.chords = (args, message, filestackClient) => {
  // ARGUMENTS
  // 0 - Subdiv
  // 1 - Pattern (x--x)
  // 2 - Repeats
  // 3+ - Chords

  // Check if arguments exist
  if (!args[0] || !args[1] || !args[2] || !args[3])
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}chords 4 x--x 2 CM Am FM GM\`\n- __Argument 1:__ Subdivision, what each X in your pattern is worth. 8 for 8th of a note, 4 for 4th of a note and so on.\n- __Argument 2:__ Pattern, x--x (for example) is note empty empty note, while x_x_ is note - note -.\n- __Argument 3:__ Repeats, how many time you want your music repeated.\n- __Argument 4:__ Chords, what chords you want to be played. (Looped by repeats) Example: \`Am FM GM\``
    );

  // Subdivision checks
  if (!parseInt(args[0]) || !/([1248])/.test(args[0]))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}chords 4 x--x 2 CM Am FM GM\`\nArgument number 1 must be 1, 2, 4 or 8.`
    );

  // Pattern checks
  if (!/(-){0,}(_){0,}(x){1,}(-){0,}(_){0,}(-){0,}/g.test(args[1]))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}chords 4 x--x 2 CM Am FM GM\`\nArgument number 2 may only contain the following: x,-,_`
    );

  // Repeats checks
  if (!parseInt(args[2]))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}chords 4 x--x 2 CM Am FM GM\`\nArgument number 3 must be a number.`
    );

  const chords = args.slice(3).join(" "); // Join chords into string

  // Chords checks
  if (!/([A-G])([M-m])/g.test(chords))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}chords 4 x--x 2 CM Am FM GM\`\nArgument number 4 must adhere to \`/([A-G])([M-m])/\`.`
    );

  // Create a new Scribbletune Clip
  const clip = scribble.clip({
    notes: chords,
    subdiv: `${args[0]}n`,
    pattern: args[1].repeat(parseInt(args[2])),
  });

  scribble.midi(clip, `${message.author.id}.mid`); // Export it as a MIDI file
  let wavBuffer = synth
    .midiToWav(fs.readFileSync(`${message.author.id}.mid`))
    .toBuffer(); // Create a WAV file buffer

  // Upload the buffer to Filestack and send it to chat
  filestackClient.upload(wavBuffer).then(async (res) => {
    await message.channel.send("Here's your result:", {
      files: [
        {
          attachment: res.url,
          name: "result.wav",
        },
      ],
    });
  });
  fs.unlinkSync(`${message.author.id}.mid`, (err) => {
    if (err) return console.error(err);
  });
};

exports.notes = (args, message, filestackClient) => {
  // ARGUMENTS
  // 0 - Subdiv
  // 1 - Pattern (xx-xx-x)
  // 2 - Repeats
  // 3+ - Notes

  // Check if arguments exist
  if (!args[0] || !args[1] || !args[2] || !args[3])
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}notes 8 x_xxx__-xxxxxx___ 4 a4 b4 c5 d5 c5 b4 c5 a4 b4 c5\`\n- __Argument 1:__ Subdivision, what each X in your pattern is worth. 8 for 8th of a note, 4 for 4th of a note and so on.\n- __Argument 2:__ Pattern, x--x (for example) is note empty empty note, while x_x_ is note - note -.\n- __Argument 3:__ Repeats, how many time you want your music repeated.\n- __Argument 4:__ Notes, what notes you want to be played. (Looped by repeats) Example: \`a4 b4 c#5 d5 c#5 b4 c#5 a4 b4 c#5\``
    );

  // Subdivision checks
  if (!parseInt(args[0] || !/([1248])/.test(args[0])))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}notes 8 x_xxx__-xxxxxx___ 4 a4 b4 c5 d5 c5 b4 c5 a4 b4 c5\`\nArgument number 1 must be 1, 2, 4 or 8.`
    );

  // Pattern checks
  if (!/(-){0,}(_){0,}(x){1,}(-){0,}(_){0,}(-){0,}/g.test(args[1]))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}notes 8 x_xxx__-xxxxxx___ 4 a4 b4 c5 d5 c5 b4 c5 a4 b4 c5\`\nArgument number 2 may only contain the following: x,-,_.`
    );

  // Repeats checks
  if (!parseInt(args[2]))
    return message.channel.send(
      `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}notes 8 x_xxx__-xxxxxx___ 4 a4 b4 c5 d5 c5 b4 c5 a4 b4 c5\`\nArgument number 3 must be a number.`
    );

  args.slice(3).forEach((note) => {
    if (!/([a-g])(#){0,1}([1-6])/g.test(note))
      return message.channel.send(
        `**Wrong syntax!**\nExample: \`${process.env.BOT_PREFIX}notes 8 x_xxx__-xxxxxx___ 4 a4 b4 c5 d5 c5 b4 c5 a4 b4 c5\`\nArgument number 4 must adhere to \`/([a-g])(#){0,1}([1-6])/\`.`
      );
  });

  const notes = args.slice(3).join(" "); // Join notes into string

  // Create a new Scribbletune Clip
  const clip = scribble.clip({
    notes: notes,
    subdiv: `${args[0]}n`,
    pattern: args[1].repeat(parseInt(args[2])),
  });

  scribble.midi(clip, `${message.author.id}.mid`); // Export it as a MIDI file
  let wavBuffer = synth
    .midiToWav(fs.readFileSync(`${message.author.id}.mid`))
    .toBuffer(); // Create a WAV file buffer

  // Upload the buffer to Filestack and send it to chat
  filestackClient.upload(wavBuffer).then(async (res) => {
    await message.channel.send("Here's your result:", {
      files: [
        {
          attachment: res.url,
          name: "result.wav",
        },
      ],
    });
    fs.unlinkSync(`${message.author.id}.mid`, (err) => {
      if (err) return console.error(err);
    });
  });
};

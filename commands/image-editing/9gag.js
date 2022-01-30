import ImageCommand from "../../classes/imageCommand.js";

class NineGagCommand extends ImageCommand {
  params = {
    water: "./assets/images/9gag.png",
    gravity: 6
  };

  static description = "Adds the 9GAG watermark to an image";
  static aliases = ["ninegag", "gag"];

  static noImage = "You need to provide an image/GIF to add a 9GAG watermark!";
  static command = "watermark";
}

export default NineGagCommand;

import ImageCommand from "../../classes/imageCommand.js";

class BandicamCommand extends ImageCommand {
  params = {
    water: "./assets/images/bandicam.png",
    gravity: 2,
    resize: true
  };

  static description = "Adds the Bandicam watermark to an image";
  static aliases = ["bandi"];

  static noImage = "You need to provide an image/GIF to add a Bandicam watermark!";
  static command = "watermark";
}

export default BandicamCommand;

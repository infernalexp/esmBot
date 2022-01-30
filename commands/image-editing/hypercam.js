import ImageCommand from "../../classes/imageCommand.js";

class HypercamCommand extends ImageCommand {
  params = {
    water: "./assets/images/hypercam.png",
    gravity: 1,
    resize: true
  };

  static description = "Adds the Hypercam watermark to an image";
  static aliases = ["hcam"];

  static noImage = "You need to provide an image/GIF to add a Hypercam watermark!";
  static command = "watermark";
}

export default HypercamCommand;

import ImageCommand from "../../classes/imageCommand.js";

class SwirlCommand extends ImageCommand {
  static description = "Swirls an image";
  static aliases = ["whirlpool"];

  static noImage = "You need to provide an image/GIF to swirl!";
  static command = "swirl";
}

export default SwirlCommand;

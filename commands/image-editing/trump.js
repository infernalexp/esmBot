import ImageCommand from "../../classes/imageCommand.js";

class TrumpCommand extends ImageCommand {
  static description = "Makes Trump display an image";

  static noImage = "You need to provide an image/GIF for Trump to display!";
  static command = "trump";
}

export default TrumpCommand;

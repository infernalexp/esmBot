import ImageCommand from "../../classes/imageCommand.js";

class UncaptionCommand extends ImageCommand {
  params() {
    const tolerance = parseFloat(this.specialArgs.tolerance);
    return {
      tolerance: isNaN(tolerance) ? 0.95 : tolerance
    };
  }

  static description = "Removes the caption from an image";
  static flags = [{
    name: "tolerance",
    type: "number",
    description: "Set the shade tolerance for the caption detection (0.0 is highest, 1.0 is lowest, default is 0.95)"
  }];

  static noImage = "You need to provide an image/GIF to uncaption!";
  static command = "uncaption";
}

export default UncaptionCommand;

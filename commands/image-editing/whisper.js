import ImageCommand from "../../classes/imageCommand.js";

class WhisperCommand extends ImageCommand {
  params(url) {
    const newArgs = this.args.filter(item => !item.includes(url));
    return {
      caption: newArgs.join(" ").replaceAll("&", "\\&amp;").replaceAll(">", "\\&gt;").replaceAll("<", "\\&lt;").replaceAll("\"", "\\&quot;").replaceAll("'", "\\&apos;").replaceAll("%", "\\%")
    };
  }

  static description = "Adds a Whisper style caption to an image";
  static aliases = ["caption4"];
  static arguments = ["[text]"];

  static requiresText = true;
  static noText = "You need to provide some text to add a caption!";
  static noImage = "You need to provide an image/GIF to add a caption!";
  static command = "whisper";
}

export default WhisperCommand;

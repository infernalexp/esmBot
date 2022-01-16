import MessageCollector from "./awaitmessages.js";
import InteractionCollector from "./awaitinteractions.js";
import fetch from "node-fetch";

export default async (client, message, pages, timeout = 120000) => {
  const manageMessages = message.channel.guild && message.channel.permissionsOf(client.user.id).has("manageMessages") ? true : false;
  const options = {
    messageReference: {
      channelID: message.channel.id,
      messageID: message.id,
      guildID: message.channel.guild ? message.channel.guild.id : undefined,
      failIfNotExists: false
    },
    allowedMentions: {
      repliedUser: false
    }
  };
  let page = 0;
  const components = {
    components: [{
      type: 1,
      components: [
        {
          type: 2,
          label: "Back",
          emoji: {
            id: null,
            name: "◀"
          },
          style: 1,
          custom_id: "back"
        },
        {
          type: 2,
          label: "Forward",
          emoji: {
            id: null,
            name: "▶"
          },
          style: 1,
          custom_id: "forward"
        },
        {
          type: 2,
          label: "Jump",
          emoji: {
            id: null,
            name: "🔢"
          },
          style: 1,
          custom_id: "jump"
        },
        {
          type: 2,
          label: "Delete",
          emoji: {
            id: null,
            name: "🗑"
          },
          style: 4,
          custom_id: "delete"
        }
      ]
    }]
  };
  const ackOptions = {
    method: "POST",
    body: "{\"type\":6}",
    headers: {
      "Content-Type": "application/json"
    }
  };
  let currentPage = await client.createMessage(message.channel.id, Object.assign(pages[page], options, pages.length > 1 ? components : {}));
  if (pages.length > 1) {
    const interactionCollector = new InteractionCollector(client, currentPage, timeout);
    interactionCollector.on("interaction", async (interaction, id, token, member) => {
      if (member === message.author.id) {
        switch (interaction) {
          case "back":
            await fetch(`https://discord.com/api/v9/interactions/${id}/${token}/callback`, ackOptions);
            page = page > 0 ? --page : pages.length - 1;
            currentPage = await currentPage.edit(Object.assign(pages[page], options));
            break;
          case "forward":
            await fetch(`https://discord.com/api/v9/interactions/${id}/${token}/callback`, ackOptions);
            page = page + 1 < pages.length ? ++page : 0;
            currentPage = await currentPage.edit(Object.assign(pages[page], options));
            break;
          case "jump":
            await fetch(`https://discord.com/api/v9/interactions/${id}/${token}/callback`, ackOptions);
            const newComponents = JSON.parse(JSON.stringify(components));
            for (const index of newComponents.components[0].components.keys()) {
              newComponents.components[0].components[index].disabled = true;
            }
            currentPage = await currentPage.edit(newComponents);
            client.createMessage(message.channel.id, Object.assign({ content: "What page do you want to jump to?" }, {
              messageReference: {
                channelID: currentPage.channel.id,
                messageID: currentPage.id,
                guildID: currentPage.channel.guild ? currentPage.channel.guild.id : undefined,
                failIfNotExists: false
              },
              allowedMentions: {
                repliedUser: false
              }
            })).then(askMessage => {
              const messageCollector = new MessageCollector(client, askMessage.channel, (response) => response.author.id === message.author.id && !isNaN(response.content) && Number(response.content) <= pages.length && Number(response.content) > 0, {
                time: timeout,
                maxMatches: 1
              });
              return messageCollector.on("message", async (response) => {
                if (await client.getMessage(askMessage.channel.id, askMessage.id).catch(() => undefined)) await askMessage.delete();
                if (manageMessages) await response.delete();
                page = Number(response.content) - 1;
                currentPage = await currentPage.edit(Object.assign(pages[page], options, components));
              });
            }).catch(error => {
              throw error;
            });
            break;
          case "delete":
            await fetch(`https://discord.com/api/v9/interactions/${id}/${token}/callback`, ackOptions);
            interactionCollector.emit("end");
            if (await client.getMessage(currentPage.channel.id, currentPage.id).catch(() => undefined)) await currentPage.delete();
            return;
          default:
            break;
        }
      }
    });
    interactionCollector.once("end", async () => {
      interactionCollector.removeAllListeners("interaction");
      if (await client.getMessage(currentPage.channel.id, currentPage.id).catch(() => undefined)) {
        for (const index of components.components[0].components.keys()) {
          components.components[0].components[index].disabled = true;
        }
        await currentPage.edit(components);
      }
    });
  }
};

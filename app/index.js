const http = require("http");
const {
  Client,
  Intents,
  MessageAttachment,
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  GatewayIntentBits,
  EmbedBuilder,
  ContextMenuCommandBuilder,
  ApplicationCommandType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  IntentsBitField,
  Guild,
  GuildMember,
  ApplicationCommandOptionType,
  MessageMentions,
  MessageActionRowOptions,
  MessageSelectMenuOptions,
  Presence,
  UserFlags,
  AttachmentBuilder,
  Colors,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
  TextChannel,
  version: discordVersion,
} = require("discord.js");
const Discord = require("discord.js");
const fs = require("fs");
const options = {
  intents: [
    "Guilds",
    "GuildBans",
    "GuildMessages",
    "GuildChannels,",
    "MessageContent",
    "GatewayIntentBits.GuildVoiceStates",
    "GatewayIntentBits.GuildMembers",
    "IntentsBitField.Flags.GuildMessages",
    "IntentsBitField.Flags.MessageContent",
    "DirectMessages",
    "DirectMessageReactions",
    "DirectMessageTyping",
    "GuildPresences",
    "Discord.Intents.FLAGS.GUILDS",
    "Discord.Intents.FLAGS.GUILD_MESSAGES",
  ],
};
const client = new Client({
  partials: ["CHANNEL"],
  intents: new Intents(32767),
});
const {
  Modal,
  TextInputComponent,
  SelectMenuComponent,
  showModal,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} = require("discord-modals");
const discordModals = require("discord-modals");
discordModals(client);
const newbutton = (buttondata) => {
  return {
    components: buttondata.map((data) => {
      return {
        custom_id: data.id,
        label: data.label,
        style: data.style || 1,
        url: data.url,
        emoji: data.emoji,
        disabled: data.disabled,
        type: 2,
      };
    }),
    type: 1,
  };
};
process.env.TZ = "Asia/Tokyo";
("use strict");
let guildId;

http
  .createServer(function (request, response) {
    response.writeHead(200, { "Content-Type": "text/plain;charset=utf-8" });
    response.end(
      `${client.user?.tag} is ready!\n導入サーバー:${client.guilds.cache.size}\nユーザー:${client.users.cache.size}`
    );
  })
  .listen(3000);

const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();
const config = require("./config.js");

client.on("ready", (client) => {
  console.log(`ログイン: ${client.user.tag}`);
  client.user.setActivity({
    type: "PLAYING",
    name: `ぷにぷにはやめろ`,
  });
  client.user.setStatus("online");
});
//ここから
const cooldowns = new Map();

client.on("messageCreate", (message) => {
  if (message.content === "お助け") {
    const embed = new MessageEmbed()
    .setTitle("お助け依頼パネル")
    .setDescription(`お助けを依頼したい場合は下の依頼ボタンからお願いします`)
    .setColor("RED")
    .setTimestamp();
    
    message.channel.send({
      embeds: [embed],
      components: [
        newbutton([
          {
            id: `carry`,
            label: "お助け依頼をする",
            style: "SUCCESS",
          },
        ]),
      ],
    });
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }
const userId = interaction.user.id;

    // クールダウンをチェック
    if (cooldowns.has(userId)) {
      const remainingTime = cooldowns.get(userId) - Date.now();
      if (remainingTime > 0) {
        const minutes = Math.ceil(remainingTime / 60000);
        return interaction.reply({
          content: `再度依頼を出すにはあと ${minutes} 分お待ちください。`,
          ephemeral: true,
        });
      }
    }
  if (interaction.customId.startsWith("carry")) {
    const customId = `${
      interaction.customId
    }-${interaction.message.embeds[0].fields
      .map((field) => field.name.charAt(0))
      .join("/")}`;

    const modal = new Modal()
      .setCustomId(customId)
      .setTitle("お助け依頼情報入力フォーム")
      .addComponents(
        new TextInputComponent()
          .setCustomId("friend")
          .setLabel("フレンドコード")
          .setStyle("SHORT")
          .setPlaceholder("ご自身のフレンドコードを入力してください")
          .setRequired(true),
        new TextInputComponent()
          .setCustomId("level")
          .setLabel("レベル")
          .setStyle("SHORT")
          .setPlaceholder("レベルを入力してください")
          .setRequired(true),
        new TextInputComponent()
          .setCustomId("talk")
          .setLabel("ひと言")
          .setStyle("LONG")
          .setRequired(false)
      );

    showModal(modal, {
      client: client,
      interaction: interaction,
    });
  }
  });

client.on("interactionCreate", async (interaction) => {
  // モーダルの提出があった場合
  if (interaction.isModalSubmit() && interaction.customId.startsWith("carry-")) {
    const friendCode = interaction.fields.getTextInputValue("friend");
    const level = interaction.fields.getTextInputValue("level");
    const talk = interaction.fields.getTextInputValue("talk");

    // フレンドコードが8文字以外の場合は処理しない
    if (friendCode.length !== 8) {
      return interaction.reply({ content: "フレンドコードは8文字である必要があります。", ephemeral: true });
    }
    
    if (level.length > 2) {
      return interaction.reply({ content: "レベルは2文字以内である必要があります。", ephemeral: true });
    }

    // 一言が20文字以上の場合は処理しない
    if (talk.length > 20) {
      return interaction.reply({ content: "ひと言は20文字以内で入力してください。", ephemeral: true });
    }

    // Embed メッセージ作成
    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("お助け依頼")
      .addFields(
        { name: "フレンドコード", value: friendCode, inline: true },
        { name: "レベル", value: level, inline: true },
        { name: "ひと言", value: talk }
      )
      .setFooter({
        text: `送信者: ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    // メッセージ送信先チャンネル
    const targetChannel = client.channels.cache.get('1388777085941715055'); // 送信先のチャンネルIDを指定

    if (targetChannel) {
      await targetChannel.send({
        content: friendCode,
        embeds: [embed],
      });
      
      cooldowns.set(interaction.user.id, Date.now() + 300000);
      
      await interaction.reply({ content: `<#1388777085941715055>に送信されました`, ephemeral: true });
    } else {
      await interaction.reply({ content: "送信先チャンネルが見つかりません", ephemeral: true });
    }
  }
});

process.on("uncaughtException", (error) => {
  console.error("未処理の例外:", error);
  fs.appendFileSync("error.log", `未処理の例外: ${error.stack}\n`);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("未処理の拒否:", reason);
  fs.appendFileSync("error.log", `未処理の拒否: ${reason}\n`);
});
//ここまで

client.login(config.token);

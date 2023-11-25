const FiveMAPI = require('./fivem-api');
const { Client, GatewayIntentBits, Partials, EmbedBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ActivityType } = require("discord.js");
const config = require("./config.json");

class FiveMBot {
    constructor() {
        this.bot = new Client({ intents: [GatewayIntentBits.Guilds], partials: [Partials.Channel] });
        this.server = new FiveMAPI(config.SERVER_URL);
        this.statusMessage = null;
    }

    async init() {
        try {
            this.bot.once("ready", () => {
                this.updateServerStatus();
                setInterval(() => this.updateServerStatus(), 60000 * config.updateMinutes);
            });
            this.bot.login(config.BOT_TOKEN);
        } catch (error) {
            console.error("Error during bot initialization: ", error);
        }
    }

    async fetchServerData() {
        try {
            const [status, players, ServerInfo] = await Promise.all([
                this.server.getServerStatus(),
                this.server.getPlayers(),
                this.server.getServerInfo()
            ]);
            if (status) {
                this.bot.user.setActivity({ name: `👥 ${players.length} players`, type: ActivityType.Watching });
            }
            return { status, players, ServerInfo };
        } catch (error) {
            console.error("Error fetching server data: ", error);
            return null;
        }
    }

    async updateServerStatus() {
        const serverData = await this.fetchServerData();
        if (!serverData) {
            console.log("Failed to fetch server data.");
            return;
        }
        const { embed: statusEmbed, Attachment, component } = this.createServerStatusEmbed(serverData);
        const channel = this.bot.channels.cache.get(config.CHANNEL_ID);

        if (!channel) {
            console.error("Channel not found");
            return;
        }

        if (!this.statusMessage) {
            try {
                const button = new ActionRowBuilder().addComponents(component)
                const message = await channel.send({ embeds: [statusEmbed], components: [button], files: [Attachment], content: ' ' });
                this.statusMessage = message;
            } catch (error) {
                console.error("Error sending status message: ", error);
            }
        } else {
            try {
                const button = new ActionRowBuilder().addComponents(component)
                await this.statusMessage.edit({ embeds: [statusEmbed], components: [button], files: [Attachment], content: ' ' });
            } catch (error) {
                console.error("Error updating status message: ", error);
            }
        }
    }

    createServerStatusEmbed({ status, players, ServerInfo }) {
        const statusEmoji = status ? "🟢" : "🔴";
        const statusText = status ? "Online" : "Offline";
        const serverName = ServerInfo?.vars?.sv_projectName
        return {
            embed: new EmbedBuilder()
                .setColor("#0099ff")
                .setTitle(`**${serverName}**`)
                .setDescription(`\`\`\`\n${ServerInfo?.vars?.sv_projectDesc}\n\`\`\``)
                .setThumbnail('attachment://icon.png')
                .addFields(
                    { name: "> Player Info", value: `\`\`\`👥 ${status ? players.length : "0"} / ${ServerInfo?.vars?.sv_maxClients}\`\`\``, inline: true },
                    { name: "> Server Status", value: `\`\`\`${statusEmoji} ${statusText}\`\`\``, inline: true },
                    { name: "> Server Region", value: `\`\`\`${ServerInfo?.vars?.locale.replace('-', ' / ')}\`\`\``, inline: true })
                .setFooter({ text: "Last Updated" })
                .setTimestamp(),
            Attachment: new AttachmentBuilder(Buffer.from(ServerInfo.icon, 'base64'), { name: 'icon.png' }),
            component: new ButtonBuilder().setLabel('Connect').setURL(config.DIRECT_CONNECT_LINK).setStyle(ButtonStyle.Link)
        }
    }
}

const bot = new FiveMBot();
bot.init();
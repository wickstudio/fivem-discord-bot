# FiveM Discord Bot

## Description
This Discord bot is designed to interact with a FiveM server, providing real-time updates and server information directly in a Discord channel. It features automatic server status updates, player count displays, and detailed server information.

## Features
- Real-time server status updates.
- Displays the current number of active players.
- Provides detailed server information.
- Easy to set up and use.

## Installation

### Prerequisites
- Node.js
- A Discord bot token and server setup.

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/wickstudio/fivem-discord-bot.git
   ```
2. Navigate to the bot's directory:
   ```bash
   cd [Your Bot's Directory]
   ```
3. Run the installation script (`install.bat`) to install required packages:
   ```bash
   install.bat
   ```

## Configuration
Configure the bot by editing the `config.json` file:

```json
{
  "BOT_TOKEN": "Your_Discord_Bot_Token",
  "SERVER_URL": "Your_FiveM_Server_IP:Port_or_Link",
  "CHANNEL_ID": "Your_Discord_Channel_ID_for_Updates",
  "DIRECT_CONNECT_LINK": "Your_Direct_Connect_Link_for_FiveM_Server",
  "updateMinutes": 1
}
```
Replace the placeholders with your actual Discord bot token, FiveM server information, and other details.

## Usage
To start the bot, run the `start.bat` script:
```bash
start.bat
```
This will initiate the bot and connect it to your Discord server and FiveM server based on the `config.json` settings.

## Contributing
Contributions to this project are welcome. Please fork the repository and submit your changes via a pull request.

## License
This project is licensed under the [MIT License](LICENSE).

## Contact
For support, questions, or contributions, join discord server [ https://discord.gg/NFh7xtMNz2 ].
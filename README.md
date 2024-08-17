# Endless Herald

## Overview

**Endless Herald** is a Discord bot designed to help you stay updated with the latest listings on the [Axie Infinity Delegate Marketplace](https://delegate.axieinfinity.com/). The bot regularly polls the marketplace website and broadcasts any new listings directly to your specified Discord channel by checking the channel name, ensuring you never miss out on new opportunities. Additionally, the bot can resolve Ronin Name Service (RNS) names for users, replacing Ronin addresses with their corresponding RNS name if one is owned by the user.

## Features

- **Automated Polling**: The bot periodically checks the Axie Infinity Delegate Marketplace for any new listings.
- **Real-time Updates**: When a new listing is detected, the bot immediately posts the details into the specified Discord channel.
- **Channel Name Detection**: The bot posts in the channel that matches the provided channel name, offering flexibility in configuration.
- **Ronin Name Service (RNS) Resolution**: The bot checks if a user owns an RNS name and replaces the Ronin address with the RNS name when broadcasting listings.

## Getting Started

### Prerequisites

- A Discord account
- A server where you have permission to add bots
- Node.js installed on your machine
- **Sky Mavis API Key** for Ronin Name Service resolution (You can generate this from the [Sky Mavis Developer Console](https://developers.skymavis.com/console/applications/))

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/endless-herald.git
   cd endless-herald
   ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Set up your environment variables**:
    Create a .env file in the root directory of the project and add your Discord bot token, the channel name where you want to receive the listings, your Sky Mavis API key for RNS name resolution, and the polling interval.
    ```plaintext
    DISCORD_TOKEN=your-discord-bot-token
    CHANNEL_NAME=your-discord-channel-name
    SM_API_KEY=your-skymavis-api-key
    POLLING_INTERVAL=* * * * * # default cron string, polls every minute
    ```

4. **Run the bot**:
    ```bash 
    node index.js
    ```

### Usage

Once the bot is running, it will start polling the Axie Infinity Delegate Marketplace at the interval specified by the `POLLING_INTERVAL` cron string. Whenever it detects a new listing, it will automatically post the details in the Discord channel that matches the specified channel name. If the listing includes a Ronin address that corresponds to an RNS name, the bot will replace the address with the RNS name.

### Customization

- **Polling Interval**: The polling interval is controlled by the `POLLING_INTERVAL` environment variable. This is a cron string job, currently set to `* * * * *`, which means the bot polls every minute. You can customize this to match your desired frequency.

- **Channel Name**: If you need to change the Discord channel where the bot posts listings, simply update the `CHANNEL_NAME` in your `.env` file.

- **RNS Name Resolution**: Ensure that the `SM_API_KEY` is correctly set in your `.env` file to allow the bot to resolve and replace Ronin addresses with RNS names.

### Troubleshooting

- **Bot Not Responding**: Ensure that the bot is properly configured with the correct token, channel name, Sky Mavis API key, and polling interval. Check if the bot has permission to post in the specified channel.
- **No Listings Found**: If the bot isn't detecting any new listings, ensure that the Axie Infinity Delegate Marketplace is accessible and that there are indeed new listings being posted.
- **RNS Name Not Replacing**: Double-check that the `SM_API_KEY` is correct and active, and that the Ronin address indeed has a corresponding RNS name.


    
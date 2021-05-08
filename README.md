# Add features Telegram Bot for pycryptobot. In Node.JS, using Telegraf

## What is this repository about?
This repository lets you run and configure a Telegram bot, easily, in order to interact with user input.
It allows you to manage the processes of the pycryptobot bot in Telegram.

## How to create the bot

### Step 1: configure pyCryptoBot with Telegram
- Open Telegram application on your computer;
https://medium.com/coinmonks/pycryptobot-with-telegram-83eed5f230c2

### Step 2: configure your Node.js application
- Create config.js in the repository root with this content. Replace API_TOKEN with the API key you got from BotFather:
```javascript
module.exports = {telegraf_token:'API_TOKEN'};
```
This file will be automatically ignored from .gitignore to secure your API key in GitHub.

- Install dependencies:
```
npm install
```
This will install all dependencies in `package.json` so just `telegraf` in order to use Telegram API.

Done! Your bot is now configured.

## Run the bot
- Start your application:
```
npm start
```
If it prints:
```
[SERVER] Bot started.
```
...congratulations! Now bot will do what you want.

![image](http://i.imgur.com/v6fmG6f.png)

## Secure your API key
In .gitignore:
```
config.js
```
API key will not be published inside your GitHub repository.
I have separated configuration logic from application logic in order to secure this key, but in a production environment it might not be enough.

Secure your API key as much as possible.
If your key gets stolen --- Bad things could happen with your bot.

If you're working on this repository with someone else, I suggest to NOT publish config.js but to share your configuration file privately with your collaborators OR let them build their own 'bot-users' with their own API keys.

# Documentation
- Usage:
/usage
/list (list all processes)
/start BTC-GBP 3600 1 ... (start a bot)
/stop BTC-GBP (stop an instance)

start parameters order: market, granularity, live, sellatloss, verbose

PyCryptoBot: https://github.com/whittlem/pycryptobot
For more informations, check Telegraf API: https://github.com/telegraf/telegraf.

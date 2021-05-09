const Telegraf = require('telegraf');
const config = require('./config');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function execCommand(command) {
  const { stdout } = await exec(command);
  return stdout;
}

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const bot = new Telegraf(config.telegraf_token);

bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized bot nickname. Nick: " + bot_informations.username);
});

bot.command('usage', (ctx) => {
    ctx.reply('/list (list all processes)\n/start BTC-GBP 3600 1 ... (start a bot)\n/stop BTC-GBP (stop an instance)');
});

bot.command('start', (ctx) => {
    // Recherche du market
    const market = ctx.update.message.text.split(' ')[1];
    if (!market) {
        ctx.reply('wrong argument, see usage');
        return;
    }
    // Vérification de l'existance
    execCommand('ps -eaf | grep pycryptobot.py | grep -v grep | grep ' + market).then((result) => {
        ctx.reply(market + ' already started');
    }).catch(() => {
        // Lancement du bot avec les params
        execCommand('cd ' + market + ';' + 'python3 pycryptobot.py --live 1' + market);
    });
});

bot.command('stop', (ctx) => {
    // Recherche du market
    const market = ctx.update.message.text.split(' ')[1];
    if (!market) {
        ctx.reply('wrong argument, see usage');
        return;
    }
    // Récupération du pid
    execCommand('ps -eaf | grep pycryptobot.py | grep ' + market + ' | awk \'{ print $2 }\'').then((pid) => {
        if (pid) {
            execCommand('kill -15 ' + pid).then(() => {
            }).catch(() => {
                ctx.reply(market + 'Stopped');
            });
        }
    });
});

bot.command('list', (ctx) => {
    // Liste les process en cours d'exécution
    execCommand('ps -eaf | grep pycryptobot.py | grep -v grep | awk \'{new_var="/stop "$12; print new_var}\'').then((result) => {
        if (result) {
            ctx.reply(result);
        }
    });
});

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
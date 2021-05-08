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

bot.command('help', (ctx) => {
    ctx.reply('/list\n/start\n/stop');
});

bot.command('start', (ctx) => {
    // Recherche du market
    const market = ctx.update.message.text.split(' ')[1];
    // Paramètres
    const params = ctx.update.message.text.split(' ').slice(2);
    // Vérification de l'existance
    execCommand('ps -ef | grep pycryptobot | grep ' + market + ' | awk \'{str = sprintf("%s %s", $1, $2)} END {print str}\'').then((result) => {
        if (result.length > 0) {
            ctx.reply(market + ' already in scope');
        } else {
            // Lancement du bot via les params
            execCommand('python pycryptobot.py --market ' + market + ' --granularity ' + params[0] + ' --live ' + params[1] + ' --sellatloss ' + params[2]
                + ' --verbose ' + params[3]).then(() => {
            });
        }
    });
});

bot.command('stop', (ctx) => {
    // Recherche du market
    const market = ctx.update.message.text.split(' ')[1];
    // Récupération du pid
     execCommand('ps -ef | grep pycryptobot | grep ' + market + ' | awk \'{ print $2 }\'').then((pid) => {
        execCommand('kill -9 ' + pid).then(() => {
            ctx.reply(market + 'Stopped');
        });
    });
});

bot.command('list', (ctx) => {
    // Liste les process en cours d'exécution
    execCommand('ps -ef | grep pycryptobot | awk \'{str = sprintf("%s %s", $1, $2)} END {print str}\'').then((result) => {
        ctx.reply(result);
    });
});

function forProcessDescription(process) {
    return '';
}

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
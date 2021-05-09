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
    execCommand('ps -eaf | grep pycryptobot.py | grep ' + market).then((result) => {
        if (result.length > 0) {
            ctx.reply(market + ' already started');
        } else {
            // Paramètres (TODO améliorer le mécanisme :D)
            const params = ctx.update.message.text.split(' ').slice(2);
            var sb = '';
            if (params.length > 0) {
                sb += ' --granularity ' + params[0];
                if (params.length > 1) {
                    sb += ' --live ' + params[1];
                    if (params.length > 2) {
                        sb += ' --sellatloss ' + params[2];
                        if (params.length > 3) {
                            sb += ' --verbose ' + params[3];
                        }
                    }
                }
            }
            // Lancement du bot avec les params
            console.log(sb);
            execCommand('python3 pycryptobot.py ' + sb + ' ' + market).then(() => {
            });
        }
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
        execCommand('kill -15 ' + pid).then(() => {
            ctx.reply(market + 'Stopped');
        });
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

function forProcessDescription(process) {
    return '';
}

// Start bot polling in order to not terminate Node.js application.
bot.startPolling();
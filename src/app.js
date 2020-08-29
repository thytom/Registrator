const Discord = require('discord.js');
const fs = require('fs')
const {token} = require('./config/auth.json');
const {prefix} = require('./config/config.json');

const client = new Discord.Client();

client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(__dirname + `/commands/${file}`);
	client.commands.set(command.name, command);
}

client.on('ready', () => {
	const guilds = client.guilds.cache.map(x => x.name);
	let guildList = "";

	for(const guild in guilds)
		guildList += `  ${guild} - ${guilds[guild]}\n`;
	
	console.log('Logged into ' + guilds.length + ' guilds: \n' + guildList);
});

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (client.commands.has(command)) {
		try {
			client.commands.get(command).execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
});

client.login(token);

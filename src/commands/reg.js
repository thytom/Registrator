const config = require('../config/config.json');
const register = config.encode.defaultFileName;

module.exports = {
	name: 'register',
	description: 'Register a user',
	async execute(message, args) {
		const ID = args.join(" ");
		const user = message.member;

		var rolesToAdd = [];		

		var nickName;

		register.forEach(role => {
			const searchArray = role.map(name => name.toLowerCase());
			if(searchArray.includes(ID.toLowerCase())) {
				if(nickName == undefined)
					nickName = role[searchArray.indexOf(ID.toLowerCase())];

				rolesToAdd.push(role);
			}
		});

		if(rolesToAdd.length == 0) {
			message.reply("sorry, I don't recognise that name. Please make sure you've spelled it correctly, or use `@Mentor` to get a human's attention!");
		}else {
			try{
				await user.edit({roles: user.guild.roles.cache.filter(r =>
					rolesToAdd.includes(r.name)), nick: nickName});

				console.log("Updated user " + user.nickname + " permissions to: " + rolesToAdd.join(', '));
				message.reply("your roles are now: " + rolesToAdd.join(', '));
			}catch (error)
			{
				console.error("Unable to edit user: " 
					+ user.nickname + ":\n ", error);
				message.reply("something went wrong! Maybe you have more permissions than me?");
			}
		}
	}
}

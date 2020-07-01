const fs = require('fs');

const config = require('../config/config.json');

module.exports = {
	name: 'register',
	description: 'Register a user',
	async execute(message, args) {
		const register = require(`../../${config.encode.registerOutputFile}`);

		const ID = args.join(" ");
		const user = message.member;

		// Prevent re-registering	
		if(user.nickname != null 
			&& Object.keys(register)
			.map(p => register[p].name.toLowerCase())
			.includes(user.nickname.toLowerCase())) {
			message.reply("looks like you've already registered!");
			return;
		}

		var rolesToAdd = [];		
		var nickName;
		var sameName = false; // Used to let the user know if their place is already taken.

		for(p in register) {
			const person = register[p];
			if(person.name.toLowerCase() === ID.toLowerCase()) {
				if(person.present === false)
				{
					person.present = true;
					nickName = person.name;
					rolesToAdd = person.roles;
					// Preserve state between runs
					fs.writeFile(config.encode.registerOutputFile, JSON.stringify(register), 'utf8', err => {
						if (err) throw "Could not write register.json:" + err;
					});
					break;
				} else{
					sameName = true;
				}
			}
		}

		if(rolesToAdd.length == 0) {
			if(sameName) {
				message.reply("it looks like everyone with that name has already registered."
				+ "If you think there's a problem, please use `@Mentor` to get a human's attention!");
			}else {
				message.reply("sorry, I don't recognise that name."
					+ " Please make sure you've typed it in correctly," 
					+ " or use `@Mentor` to get a human's attention!");
			}
		}else {
			try{
				await user.edit({roles: user.guild.roles.cache.filter(r =>
					rolesToAdd.includes(r.name)), nick: nickName});

				console.log("Updated user " + user.nickname + " permissions to: " + rolesToAdd.join(', '));
				message.reply("your roles are now: " + rolesToAdd.join(', '));
			}catch (error) {
				console.error("Unable to edit user: " 
					+ user.nickname + ":\n ", error);
				message.reply("something went wrong! Maybe you have more permissions than me?");
			}
		}
	}
}

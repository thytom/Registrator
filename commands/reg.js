var permissions = require('../register.json');

module.exports = {
	name: 'register',
	description: 'Register a user',
	execute(message, args) {
		var ID = args[0];
		user = message.member;

		if(permissions[ID])
		{
			namesToAdd = permissions[ID].split(';');
			console.log(namesToAdd);
			rolesToAdd = user.guild.roles.cache.filter(r => namesToAdd.includes(r.name));

			console.log(namesToAdd);

			user.edit({roles: rolesToAdd});
			console.log("Updated user " + user.nickname + " permissions to: " + namesToAdd);
			message.reply("your roles are now: " + namesToAdd);
		}else
		{
			message.reply("sorry, that's not a valid ID!");
			return;
		}
	}
}

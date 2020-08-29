const fs = require('fs');

const config = require('../config/config.json');

/* All are prepended with "@User, " */
const responses = {
	alreadyRegistered: "is looks like everyone with that name has already registered."
		+ " If you think there's a problem, please use `@Mentor` to get a human's attention!",

	notOnRegister: "sorry, I don't recognise that name."	
		+ " Please make sure you've typed it in correctly,"
		+ " or use `@Mentor` to get a human's attention!",

	somethingWentWrong: "sorry, something went wrong. Please use `@Mentor` to"
		+ " be let in manually while we try and solve the problem."
};

module.exports = {
	name: 'register',
	description: 'Register a user',
	async execute(message, userFullNameArray) {
		const register = require(`../../${config.encode.registerOutputFile}`);
		const userFullName = userFullNameArray.join(" ");
		const userAccount = message.member;
		var rolesToAdd = [];		
		var placeAlreadyTaken = false; // Used to let the user know if their place is already taken.


		const matchingRecord = getMatchingRecordsInRegister(userFullName, register)
														.filter(record => record.present == false)[0];

		if(matchingRecord) {
			markAsPresentOnRegister(matchingRecord, register);
		} else {
			// TODO: Error
		}

		if(rolesToAdd.length == 0) {
			if(placeAlreadyTaken) {
				message.reply(responses.alreadyRegistered);
			}else {
				message.reply(notOnRegister);
			}
		} else {
			try{
				updateUserAccountRolesAndNickname(userAccount, rolesToAdd, userFullName);

				console.log("Updated user " + userAccount.nickname + " permissions to: " + rolesToAdd.join(', '));
				message.reply("your roles are now: " + rolesToAdd.join(', '));
			}catch (error) {
				console.error("Unable to edit user: " 
					+ userAccount.nickname + ":\n ", error);
				message.reply("something went wrong! Maybe you have more permissions than me?");
			}
		}
	}
}

function getMatchingRecordsInRegister(userFullName, register) {
	var recordsToReturn = null; 

	for(recordIndex in register) {
		const record = register[recordIndex];

		if(record.name.toLowerCase() === userFullName.toLowerCase())
			recordsToReturn.push(record);
	}

	return recordsToReturn;
}

function markAsPresentOnRegister(record, register) {
	register[record].present = true;

	fs.writeFile(config.encode.registerOutputFile, JSON.stringify(register), 'utf8', err => {
		if (err) throw "Could not write register.json: " + err;
	});
}

function updateUserAccountRolesAndNickname(userAccount, rolesToAdd, newNickName) {
	await userAccount.edit({
		/* Only add roles the server actually implements */
		roles: userAccount.guild.roles.cache
					.filter(r => rolesToAdd.includes(r.name)), 
		nick: newNickName
	});
}

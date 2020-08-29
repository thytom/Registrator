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
	execute(message, userFullNameArray) {
		const register = require(`../../${config.encode.registerOutputFile}`);
		const userFullName = userFullNameArray.join(" ");
		const userAccount = message.member;

		const matchingRecord = getMatchingNonPresentRecordIfExists(userFullName, register);

		try{
			if(matchingRecord) {
				markAsPresentOnRegister(matchingRecord, register);
				updateUserAccountRolesAndNickname(userAccount, matchingRecord.roles, userFullName);
				console.log("Updated user " + userAccount.nickname + " permissions to: " + rolesToAdd.join(', '));

			} else if(matchingRecord == undefined){
				message.reply(alreadyRegistered);
				console.error("User " + userAccount.nickname + " already present, cannot re-register.");

			} else if(matchingRecord == null) {
				message.reply(notOnRegister);
				console.error("User " + userAccount.nickname + " not found on the register.");
			}
		}catch (err) {
			console.error("Unable to edit user: " 
				+ userAccount.nickname + ":\n ", err);
			message.reply("something went wrong! Maybe you have more permissions than me?");
		}
	}
}

/* Returns:
null - no records found
undefined - records found but all already present
record object - record found and not present */
function getMatchingNonPresentRecordIfExists(userFullName, register) {
	const recordToReturn = null;
	const matchingRecords = getMatchingRecordsInRegister(userFullName, register);

	if(matchingRecords.length > 0)
		recordToReturn = matchingRecords.filter(record => record.present == false)[0];

	return recordToReturn;
}

function getMatchingRecordsInRegister(userFullName, register) {
	var recordsToReturn = []; 

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
	userAccount.edit({
		/* Only add roles the server actually implements */
		roles: userAccount.guild.roles.cache
					.filter(r => rolesToAdd.includes(r.name)), 
		nick: newNickName
	});
}

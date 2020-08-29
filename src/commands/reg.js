const fs = require('fs');

const config = require('../config/config.json');

/* Readable definitions for matchingRecord errors */
const matchingRecordError = {
	alreadyRegistered: undefined,
	notOnRegister: null
};

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

		/* Can be a record, can also be an error */
		const matchingRecord = getFirstAbsentMatchFromRegister(userFullName, register);

		try{
			if(matchingRecord) {
				markAsPresentOnRegister(matchingRecord, register);
				updateUserAccountRolesAndNickname(userAccount, matchingRecord.roles, userFullName);
				console.log("Updated user " + userAccount.nickname 
					+ " permissions to: " + matchingRecord.roles.join(', '));

			} else if(matchingRecord == matchingRecordError.alreadyRegistered){
				message.reply(responses.alreadyRegistered);
				console.error("User " + userAccount.user.username + " already present, cannot re-register.");

			} else if(matchingRecord == matchingRecordError.notOnRegister) {
				message.reply(responses.notOnRegister);
				console.error("User " + userAccount.user.username + " not found on the register.");
			}
		}catch (err) {
			console.error("Unable to edit user: " 
				+ userAccount.nickname + ":\n ", err);
			message.reply(responses.somethingWentWrong);
		}
	}
}

function getFirstAbsentMatchFromRegister(userFullName, register) {
	const matchingRecords = getMatchingRecordsInRegister(userFullName, register);
	const matchingNonPresentRecords = matchingRecords
		.filter(record => record.present == false);

	if(matchingRecords.length == 0)
		return matchingRecordError.notOnRegister;
	else if(matchingNonPresentRecords.length == 0)
		return matchingRecordError.alreadyRegistered;
	else
		return matchingNonPresentRecord[0];
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
	record.present = true;

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

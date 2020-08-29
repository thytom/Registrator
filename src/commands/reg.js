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

	nicknameSet : "sorry, it appears that you might already be registered."
		+ " If you think this is a mistake, please get the attention of a human by typing"
		+ " `@Mentor`.",

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

		if(userAccount.nickname) {
			message.reply(responses.nicknameSet);
			console.error(`User "${userAccount.user.username}"`
				+ " attempted to register as " + `"${userFullName}"`
				+ ` but their nickname is already set to "${userAccount.nickname}"`);
			return;
		}

		/* Can be a record, can also be an error */
		const matchingRecord = getFirstAbsentMatchFromRegister(userFullName, register);

		try{
			if(matchingRecord) {
				const rolesToAdd = validateRoles(userAccount, matchingRecord.roles);

				updateUserAccountRolesAndNickname(userAccount, rolesToAdd, userFullName);
				markAsPresentOnRegister(matchingRecord, register);
				console.log("Updated user " + userAccount.nickname 
					+ " permissions to: " + rolesToAdd.map(role => role.name).join(', '));

			} else if(matchingRecord === matchingRecordError.alreadyRegistered){
				message.reply(responses.alreadyRegistered);
				console.error(`User "${userAccount.user.username}"`
					+ " attempted to register as " + `"${userFullName}"`
					+ " but is already present, cannot re-register.");

			} else if(matchingRecord === matchingRecordError.notOnRegister) {
				message.reply(responses.notOnRegister);
				console.error(`User "${userAccount.user.username}"`
					+ " attempted to register as " + `"${userFullName}"`
					+ " but was not found on the register.");
			}
		}catch (err) {
			console.error("Unable to edit user " 
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
	{
		console.log("Ha");
		return matchingRecordError.notOnRegister;
	}
	else if(matchingNonPresentRecords.length == 0)
		return matchingRecordError.alreadyRegistered;
	else
		return matchingNonPresentRecords[0];
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
		roles: rolesToAdd,
		nick: newNickName
	});
}

function validateRoles(userAccount, rolesToAdd) {
	const serverRoles = userAccount.guild.roles.cache;
	var invalidRoles = getInvalidRoles(serverRoles, rolesToAdd);

	if(invalidRoles.length > 0)
		warnAboutInvalidRoles(userAccount, invalidRoles);

	const validRolesToAdd = rolesToAdd.filter(role => !invalidRoles.includes(role));
	const validRolesToAddAsObjects = serverRoles
			.filter(roleObject => validRolesToAdd.includes(roleObject.name));

	return validRolesToAddAsObjects;
}

function getInvalidRoles (serverRoles, rolesToAdd) {
	const serverRoleNames = serverRoles.map(role => role.name);
	const invalidRoles = rolesToAdd.filter(role => serverRoleNames.includes(role) == false);

	return invalidRoles;
}

function warnAboutInvalidRoles(userAccount, invalidRoles) {
	console.error("WARNING: The following roles are NOT IMPLEMENTED in the target server " 
		+ `"${userAccount.guild.name}"`
		+ 	" and so cannot be added to the user "
		+ `"${userAccount.user.username}": `
		+ invalidRoles);
}

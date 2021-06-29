const fs = require('fs');
const config = require('../src/config/config.json');

// Line format = FULLNAME|GROUP1 GROUP2 ...
function encodeJSON(fileContents){
	var register = {};

	var lines = fileContents.split('\n');
	for(var i = 0; i < lines.length - 1; i++){
		var tokens = lines[i].split('|');
		const name = `${tokens.shift()}`;
		const roles = tokens;
		register[i] = {
			name: name,
			roles: roles,
			present: false,
		};
	}

	return JSON.stringify(register);
}

const fileNameToRead = (process.argv[2]) ? process.argv[2] : config.encode.defaultRegisterFile;

if(!fileNameToRead)
{
	throw "No filename available";
}

fs.readFile(fileNameToRead, 'utf8', (err, data) => {
	if(err){
		throw `Could not read ${fileNameToRead}.`;
	} else {
		fs.writeFile(config.encode.registerOutputFile, encodeJSON(data), 'utf8', err => {
			if (err) throw "Could not write register.json";
		});
	}
});

const fs = require('fs');
const config = require('../src/config/config.json');

// Line format = FIRSTNAME LASTNAME GROUP1 GROUP2 ...
function encodeJSON(fileContents){
	var groups = {};

	fileContents.split('\n').forEach(line => {
		var tokens = line.split(' ');
		const name = `${tokens.shift()} ${tokens.shift()}`;
		tokens.forEach(token => {
			groups[token] === undefined ? 
				groups[token] = [(name)]:
				groups[token].push(name);
		});
	});

	return JSON.stringify(groups);
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
		fs.writeFile(`${config.encode.defaultOutputFile}`, encodeJSON(data), 'utf8', err => {
			if (err) throw "Could not write register.json";
		});
	}
});

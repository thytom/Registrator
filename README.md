# Registrator (Name subject to change)

This Discord bot is designed to automate the UoN CompSci Discord registering
process for new students.

Running this bot requires the creation of a file, `auth.json`, containing a
discord authentication token. You can get one by making a bot profile through
the discord developer portal. Example:

```javascript
{
	"token" : "alkjh12831ASdbBA1jahsk2j31h1kjajkab2" // Dummy key. Don't try it ;P
}
```

_**Without this token, this bot WILL NOT run.**_

## Current Features/Commands

* `!register FIRSTNAME LASTNAME`
	* Looks up the user in a JSON file and applies any roles that they belong
	  to.

## Planned Features/Commands

* One-time registration
	* Checks that a person in the Discord with the name provided isn't already
	  registered and present in the Discord
	* Would prevent people from sneaking their friends into the Discord under
	  the same name.

* Lock-to-channel (`!lock`) (**Sr. Mentor/Staff**)
	* Force the bot to only listen for the `!register` command on a specific
	  channel.
	* Could also be configured as a

* Log Channel (`!log`) (**Sr. Mentor/Staff**)
	* Enable logging to a specific channel.

* Plaintext-to-JSON Converter
	* Convert a plaintext tab-separated file of people and roles into the valid
	  JSON for this bot to be able to read.

## Ideas

* `!audit` (**Mentor/Sr. Mentor/Staff**)
	* Does an audit of the server, tells

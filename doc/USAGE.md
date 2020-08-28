# Usage

## !register

Usage: `!register FIRSTNAME LASTNAME`

The register command is used to automatically apply new users their specified
roles, like "Student" or "Group-0". It also applies a nickname to a user, and
only allows a user to register once.

Should multiple users have the same name, the bot will keep track of who is
already present and skip those entries, applying the roles of the next
non-present entry it finds. Once it's checked the whole register for duplicate
names, the bot will inform someone that everyone with that name has already
registered.

## The Register

Although the default register files are `register/register.txt` and
`register/register.json`, this can be configured differently in
`src/config/config.json`, allowing the bot to switch to another register file
(useful for having separate ones for staff/mentors and students).

`register.txt` is a plaintext file delimited by the '|' character that 
follows this format:

```
name|Role1 Role2 ...
John Doe|Mentor
Jane Doe|Student tutor-group-01
```

This file is intended to be in a format that could be easily exported from a
spreadsheet. It's converted to `register.json`, as shown below, and then
completely ignored.

Using the command `npm run new_register`, this file gets converted into a more
complex JSON equivalent, which is more easily interpreted and modified by the
bot:

```javascript
{
	"0":{
		"name":"John Doe",
		"roles":["Student"],
		"present":false
	},
	"1":{
		"name":"Jane Doe",
		"roles":["Student"],
		"present":true
	}
}
```

*Note: The actual file is all just on one line, I've beautified it for the sake
of clarity.*

This file is both read and written to by the bot at runtime, and preserves state
via the "present" variable, which keeps track of who's joined even if the bot
crashes.

It is advisable to not edit `register.json` directly, but instead make the
change in `register.txt` and run `npm run new_register`. This obviously can't be
done if roles must be modified but state preserved. In that case, manual
intervention within Discord is advised.

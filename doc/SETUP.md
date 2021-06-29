# Setup Guide

## Contents

1. [Prerequisites](#prerequisites)
2. [Download the Repo](#download-the-repo)
3. [Creating a Discord Bot](#creating-a-discord-bot)
4. [Inviting the Bot to Your Server](#inviting-the-bot-to-your-server)
5. [Adding an Authorisation Key](#adding-an-authorisation-key)
6. [Adding a Register](#adding-a-register)
7. [Installation](#installation)

## Prerequisites

To install and run this bot, you will need:

* `nodejs`
* `npm`
* `git`

Install these using your favourite package manager:

Arch-based:
```
$ sudo pacman -S nodejs npm git
```

Debian-based:
```
$ sudo apt install nodejs npm git
```

Windows (Using `chocolatey` or `scoop`):

```
$ cinst nodejs.install git
# or
$ scoop install nodejs git
```

MacOS (using `homebrew`):

```
$ brew install node git
```

If you're on anything else, you probably know what you're doing. View a full
list of download options for nodejs+npm
[here](https://nodejs.org/en/download/package-manager) and git install wizards
[here](https://git-scm.com/downloads).

## Download the Repo

Either download the repo as a zip, or clone it:

```
$ git clone https://github.com/thytom/registrator
```

## Creating a Discord Bot

Go to the [Discord developer portal](https://discord.com/developers) and log in.

From there, make sure you're in the "Applications" tab on the left, and click
"New Application" in the top right. Call it whatever you want.

Do any kind of customisation you want, then navigate to the "Bots" tab and add
click "Add Bot" on the right. Give the bot a username and an icon if you wish.
Remember the "Token" section under the bot's name; we'll come back to this.

Navigate to the OAuth2 tab. In the section named "Scopes", tick the "Bot" box,
and in the new section that appears below, select desired permissions.

**To work correctly this bot needs the following permissions:**

* Send Messages
* Manage Roles
* Manage Nicknames

Feel free to add more than this, as more may be needed for upcoming
features.

## Inviting the Bot to Your Server

In the scopes box, a link beginning with "https://discord.com/api/oauth2..."
should have appeared. Copy it, and then paste it into your browser.

From here, you'll be able to choose which server you want to add the bot to.
Make sure you've created a server at this point.

## Adding an Authorisation Key

Going back to the "Bot" tab, click "Copy" in the "Token" section. This should
copy a string to your clipboard that looks like this: 

```
NzI3MjIyMjI4OTExMTI4Njg2.Xvosuw.9XyqQN3QT70W3MSFjn8yFiEhzA8
```

*The key in this document is no longer valid, and serves only as an example.*

Create a file in your cloned repo called `auth.json` in the location
`src/config/auth.json` with these contents:

```javascript
{
	"token" : "NzI3MjIyMjI4OTExMTI4Njg2.Xvosuw.9XyqQN3QT70W3MSFjn8yFiEhzA8"
}
```

Where the key is replaced with the one you copied earlier. 

## Adding a Register

The register contains the list of people who should be on the server and their
roles.

The user register is kept in the `./register` directory. The default plaintext
register is located at `./register/register.txt`. The file follows this format:

```
FULL NAME|ROLE1|ROLE2|ROLE3

E.G:

John Doe Mentor|mentor-group-01|Student
Jane Doe Student|mentor-group-01|Student
```

This format can easily be exported from a spreadsheet, and can be converted into
the JSON format the bot reads automatically using a script in the following
section.

## Installation

Now that we've added all the necessary files, we can install the necessary
`node.js` packages, encode the register into JSON and run the bot:

```
$ npm i
$ npm run new_register
$ npm start 
```

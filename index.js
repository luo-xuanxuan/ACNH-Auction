// this is our discord api
const Discord = require('discord.js');

// we use this for our config, ask me for it if you need to test something as we dont have
// a dedicated place for the bot atm
const config = require("./config.json");

// this contains our sqlite library and the definition for profiles
const sql = require('./ProfileDefinition.js'); 
// our database of profiles
const Profiles = sql.Profiles;

// this is the bot itself
const client = new Discord.Client();

// this code runs once; when the bot is launched
client.once('ready', () => {
	console.log('Ready!');

	// keeps current db
	//Profiles.sync();

	// clears db
	Profiles.sync( { force: true } );
});

// Triggers whenever the bot reads a message I think
client.on('message', async message => {
	if (message.content === '!ping') {
		// send back "Pong." to the channel the message was sent in
		message.channel.send('Pong.');
	}

	// Ignores any messages sent by bots
	if(message.author.bot) return;
    
    // Ignores any messages that do not start with config.prefix
	if(message.content.indexOf(config.prefix) !== 0) return;
	
	// Here we separate our "command" name, and our "arguments" for the command. 
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift();
	
	// commands below here, this is gonna be rough looking for a while *sweats*

	// this command will be used for initializing a user's profile, im lazy rn but
	// it may be better to turn these into functions later; also can probably combine create/profile
	if(command === "create") {
		try {
			// creates a new entry in the database of profiles using their discord id
			const profile = await Profiles.create({
				uuid: message.author.id,
			});
			return message.reply(`Profile created.`);
		}
		catch (e) {
			if (e.name === 'SequelizeUniqueConstraintError') {
				return message.reply('That profile already exists.');
			}
			console.log(e);
			return message.reply('Something went wrong with creating a profile');
		}
	} else if (command === "profile") {
		// displays profile as rich embed

		// var member will be used when we use arguments so someone can look up another user in the future
		var member = message.guild.member(message.author.id);

		// searches db for profile
		const profile = await Profiles.findOne({ where: { uuid: member.id } });

		//creates rich embed
		const profileEmbed = new Discord.MessageEmbed()
		.setColor('#008000')
		.setTitle(member.displayName)
		.setImage(message.author.displayAvatarURL())
		.setDescription( profile.get('bio') )
		.addFields(
			{ name: 'Rep', value: profile.get('rep') },
		)
		.setTimestamp()
		
		//sends embed
		message.channel.send(profileEmbed);
	}

});

client.login(config.token);
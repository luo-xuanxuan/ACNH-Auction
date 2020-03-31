// imports sequelize for use so we dont have to import it on anything requiring these definitions
const Sequelize = require('sequelize');

// initializes our database
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

module.exports = {
    // Profile Definition
    Profiles: sequelize.define('profiles', {
        uuid: {
            type: Sequelize.STRING,
            unique: true
        },
        title: {
            type: Sequelize.STRING,
            defaultValue: "New Villager"
        },
        bio: {
            type: Sequelize.STRING,
            defaultValue: ""
        },
        rep: {
            type: Sequelize.INTEGER,
            defaultValue: 0
        },
        buying: {
            type: Sequelize.STRING, 
            // redefining get/set for these so we can make them JSON arrays
            get: function() {
                return JSON.parse(this.getDataValue('buying'));
            }, 
            set: function(val) {
                return this.setDataValue('buying', JSON.stringify(val));
            }
        },
        selling: {
            type: Sequelize.STRING, 
            get: function() {
                return JSON.parse(this.getDataValue('selling'));
            }, 
            set: function(val) {
                return this.setDataValue('selling', JSON.stringify(val));
            }
        }

    })
};
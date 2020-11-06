"use strict";

const { ServiceBroker } = require("moleculer");
const DbService = require("moleculer-db");
const SqlAdapter = require("moleculer-db-adapter-sequelize");
const Sequelize = require("sequelize");

const broker = new ServiceBroker();

// Create a Sequelize service for `post` entities
broker.createService({
    name: "testsposgress",
    mixins: [DbService],
    adapter: new SqlAdapter(`postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/henrybanck`, {
        logging: false, // set to console.log to see the raw SQL queries
        native: false, // lets Sequelize know we can use pg-native for ~30% more speed
    }),
    model: {
        name: "test",
        define: {
            name: Sequelize.STRING,
            password: Sequelize.TEXT,
        },
        options: {
            // Options from http://docs.sequelizejs.com/manual/tutorial/models-definition.html
        }
    },
    afterConnected() {
		adapter = this.adapter;
		console.log('DB ', adapter)
	}
});


broker.start()
// Create a new post
.then(() => broker.call("posts.create", {
    name: "Camilo",
    password: "12345",
}))

// Get all posts
.then(() => broker.call("posts.find").then(console.log));



"use strict";



/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */
const { MoleculerClientError } = require("moleculer").Errors;
const DbService = require("../mixins/db.mixin");

// USER.service.js
module.exports = {
	name: "users",
	mixins: [ 
		DbService ("users"), 
	  ], 
	  
	settings: {
	/** Public fields */
		fields: ["_id", "name", "password"],
	/** Validator schema for entity */
		entityValidator: {
		 name: { type: "string"},
		 password: { type: "string"},
		}
	 },

	 afterConnected() {
        console.log('connnect ok')
    },

	actions: {
	    getUsers(ctx) {
	        return 'Hola User';
		},
		nameUser(ctx) {
			console.log('AQUI ES ID !!', ctx)
	        return 'Hola User whit name ' + ctx;
		},
		// async createdUser(ctx){
		// 	const entity = ctx.params
		// 	console.log('AQUI ES POST !!', ctx.params)
		// 	if(entity.name){
		// 		const found = await this.adapter.findOne({
		// 		email: entity.email
		// 		});
		// 		if(found){
		// 			return Promise.reject(
		// 				new MoleculerClientError('Email Existe', 422, 'Email Exist', [{ field: "name", message: "Name exists"}])
		// 			);
		// 		}else{
		// 			entity.password = entity.password || "";
		// 			entity.name = entity.name || ""
		// 			const doc = await this.adapter.insert(entity);
		// 			// const user = await this.transformDocuments(ctx, {}, doc);
		// 			// const json = await this.transformEntity(
		// 			//   user,
		// 			//   true,
		// 			//   ctx.meta.token
		// 			// );
		// 			return doc
		// 		}
				
		// 	}
			
		// },

		list: {
			async handler(){
				const users = await this.adapter.find();
				return users
			}
			
		},
		
		create: {
			// params: {
			// 	user: { type: "object" }
			// },
			async handler(ctx) {
				let entity = ctx.params;
				await this.validateEntity(entity);
				if (entity.name) {
					//return 'Hola POST'
					const found = await this.adapter.findOne({ name: entity.name });
					if (found)
						return Promise.reject(
							new MoleculerClientError("Name exists!", 422, "Name exists!", [{ field: "name", message: "Name exists"}])
						);
				}
				// entity.password = bcrypt.hashSync(entity.password, 10);
				entity.password = entity.password || "";
		 		entity.name = entity.name || ""

				const doc = await this.adapter.insert(entity);
				const user = await this.transformDocuments(ctx, {}, doc);
				return this.entityChanged("created", user, ctx).then(() => user);
			    }
			},
		}
}
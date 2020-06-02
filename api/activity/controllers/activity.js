const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
	async create(ctx) {
		let entity;
		// Check if the form is multipart
		if (ctx.is("multipart")) {
			const { data, files } = parseMultipartData(ctx);
			entity = await strapi.services.activity.create(data, { files });
		} else {
			entity = await strapi.services.activity.create(ctx.request.body);
		}

		entry = sanitizeEntity(entity, { model: strapi.models.activity });

		// send an email by using the email plugin
		await strapi.plugins["strapi-provider-email-sendgrid"].services.email.send({
			to: "arielpasilang11@gmail.com",
			from: "arielpasilang@strapi.io",
			subject: "Test Email",
			text: "hello world"
		});

		return entry;
	}
};

module.exports = ({ env }) => ({
	email: {
		provider: "sendgrid",
		providerOptions: {
			apiKey:
				"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"
		},
		settings: {
			defaultFrom: "arielpasilang@strapi.io",
			defaultReplyTo: "arielpasilang11@gmail.com"
		}
	}
});

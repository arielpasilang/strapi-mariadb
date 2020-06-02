const { sanitizeEntity } = require("strapi-utils");

module.exports = {
	async update(ctx) {
		const { id } = ctx.params;

		const findOneEntity = await strapi.services.activity.findOne({ id });

		/* NOTE: This is optional code to sanitize Entity means removing private fields.
		 This is an added function that might affect the speed of processing.
		 We will just implement the sanitize Entity after update method. */

		const activityData = sanitizeEntity(findOneEntity, {
			model: strapi.models.activity
		});

		/* -------------------------------------------------------------------------- */

		// Check if it has request body discount.
		if (!ctx.request.body.discount) {
			return "Please provide discount";
		}

		// Function that will handle discount.
		const handleDiscount = price => {
			if (price) {
				const discountPrice = ctx.request.body.discount * price;
				return price - discountPrice;
			} else {
				return 0;
			}
		};

		// Now that we have the activity data by ID,
		// we are now going to update the price of 3 languages.
		// So the our body format looks like this.

		const updatePriceBody = {
			price: handleDiscount(activityData.price),
			german: {
				price: handleDiscount(activityData.german.price)
			},
			spanish: {
				price: handleDiscount(activityData.german.price)
			}
		};

		// Last would be to update the price of 3 languages using the udpate method.
		const updateEntity = await strapi.services.activity.update(
			{ id },
			updatePriceBody
		);

		// NOTE: This is only to check if the discount is working.

		// Return Sanitized Entity
		return sanitizeEntity(updateEntity, { model: strapi.models.activity });
	}
};

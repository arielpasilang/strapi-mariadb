# Strapi + MariaDB application

## Strapi Credentials

Username: root
Password: password

## Database Access

Database Name: Strapimariadb
Username: root
Password: password
Host: 127.0.0.1
Port: 3306

## Task Details

### 1. Install a local instance of the latest stable Strapi CMS with MariaDB as a database.

Strapi and MariaDB

Install MariaDB and take note of the port, address, username and password.
Check if mariadb is starting.
For windows users:

- Go to Services -> and Make sure MariaDB is running.
- Create a new database. Run MySQL Client and type “create database <database_name>”
  Create a new Strapi Project and make sure to select custom installation. Make sure to select mysql(also this is the mariadb) as a database.
- Database Name
- Host(127.0.0.1)
- Port (3306)
  -Username: root
  -Password: pass
  In the terminal, please run npm install then run the strapi project using this command:
- npm run develop for npm users
- yarn develop for yarn users
  It will be hosted locally at http://localhost:1337/admin/
- Enter your desired Username, and password.

### 2. Create one content type (collection type) in Strapi named Activities.

Go to Plugins -> Content-Type-Builder and Create Activities.

### 3. Activities content type should have the below fields Title, Sub-Title, Description, Pictures, Price.

Now Create these fields. Make sure it is on a small letter example (title, subtitle, etc)
Title = text as short description
Sub-title = text as long description
Description = Rich Text
Pictures = Media
Price = Number. You can choose between decimal or float for this. I choose 2 decimals for price because we don’t want to display more than 2 decimal points unless for calculations.

This is how it looks.
https://gyazo.com/2abce952547a74adb53f4e43908c4f47

### 4. Each field in the Activities content type should be multilingual (EN, DE, ES). Hint: This can be achieved using components in Strapi or you can use any other solution as well.

By default, the content types that we created in step 3 are for english language.

We can create other content types for German and Spanish Language by creating a component.
Create a component where category is “language” and name is spanish and german
https://gyazo.com/a3219e1b8217f796d84019e5581985b5

Notes: Change repeatable to false. Go to src/api/activities/models and go to German and Spanish.

Create a custom endpoint PUT /activities_price for Activities which accepts a JSON body with parameters as below: - { Discount: 10 } This put request will update all the activities price and decrease them by the percent (e.g. 10% as per the above JSON object). Hint: Strapi provides standard endpoints by default for each content type but for this step a custom endpoint needs to be created for the Activities content type.

- Go to Public -> Roles and Permissions -> Activities -> Check the update (represents put in rest api) also enable the find.

Lets create a website path /activities_price that when accessed, it will automatically update the price to 10% discounted.

1. Go to api/activities/config/routes.json

Note: Authenticated users if the update price can only be accessed by authenticated users. Since this is just for a demo, we will go to the public.

2. Add this code to routes.json:

```
  {
    "method": "PUT",
    "path": "/activities_price/:id",
    "handler": "activities_price.update",
    "config": {
      "policies": []
    }
  }
```

3. Go to api/activities/controllers and create activities_price.js

Code:

```
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

```

### 5. Configure a plugin to send automatic email to info@mallorcard.es whenever a new Activity is created in activities. Using Strapi plugin system is Mandatory. Hint: Can be achieved by using Nodemailer provider. For this step you can create a sample Gmail or any other email provider account for testing.

- It seems I encountered an issue while doing this. I can't seem to see the mail cog button. Following my issue here:

https://github.com/strapi/strapi/discussions/6509

### 6. Commit the complete Strapi application with database dump, Strapi and DB credentials in Readme file to GIT (e.g. GitHub, Gitlab, Bitbucket).

- Database Dump = strapimariadb.sql

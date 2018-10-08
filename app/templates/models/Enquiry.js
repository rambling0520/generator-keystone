var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Enquiry Model
 * =============
 */

var Enquiry = new keystone.List('Enquiry', {
	nocreate: true,
	noedit: true,
});

Enquiry.add({
	name: { type: Types.Name, required: true },
	email: { type: Types.Email, required: true },
	phone: { type: String },
	// rambling: 問い合わせ種別を日本語化
	enquiryType: { type: Types.Select, options: [
		{ value: 'message', label: '管理人へのメッセージ' },
		{ value: 'question', label: 'サイトや記事に関する質問' },
		{ value: 'other', label: 'その他' },
	] },
	message: { type: Types.Markdown, required: true },
	createdAt: { type: Date, default: Date.now },
});
<% if (includeEmail) { %>
Enquiry.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enquiry.schema.post('save', function () {
	if (this.wasNew) {
		this.sendNotificationEmail();
	}
});

Enquiry.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function (err) {
			if (err) {
				console.error('There was an error sending the notification email:', err);
			}
		};
	}

	if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
		console.log('Unable to send email - no mailgun credentials provided');
		return callback(new Error('could not find mailgun credentials'));
	}

	var enquiry = this;
	var brand = keystone.get('brand');

	keystone.list('<%= userModel %>').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		new keystone.Email({
			templateName: 'enquiry-notification',
			transport: 'mailgun',
		}).send({
			to: admins,
			from: {
				name: '<%= projectName %>',
				email: 'contact@<%= utils.slug(projectName) %>.com',
			},
			subject: 'New Enquiry for <%= projectName %>',
			enquiry: enquiry,
			brand: brand,<% if (viewEngine === 'hbs') { %>
			layout: false,<% } %>
		}, callback);
	});
};
<% } %>
Enquiry.defaultSort = '-createdAt';
Enquiry.defaultColumns = 'name, email, enquiryType, createdAt';
Enquiry.register();

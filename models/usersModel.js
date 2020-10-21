const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,

			required: [true, 'A user must have a username'],
		},
		password: {
			type: String,
			required: [true, 'a user must have a password'],
		},
		email: {
			type: String,

			required: [true, 'A user must have an email'],
		},
		joinDate: {
			type: Date,
			default: Date.now,
		},
		favorites: [
			{
				type: mongoose.Schema.ObjectId,
				ref: 'Recipe',
			},
		],
	},
	{
		timestamps: true,
	}
);
userSchema.pre('save', function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) {
				return next(err);
			}
			this.password = hash;
			next();
		});
	});
});
const User = mongoose.model('User', userSchema);
module.exports = User;

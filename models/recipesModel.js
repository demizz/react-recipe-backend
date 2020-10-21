const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'A recipe must have a name'],
		},
		imageUrl: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: [true, 'A recipe must have a description'],
		},
		category: {
			type: String,
			required: [true, 'A recipe must have a category'],
		},
		instructions: {
			type: String,
			required: [true, 'a recipe must have an instructions'],
		},
		createdDate: {
			type: Date,
			default: Date.now,
		},
		likes: {
			type: Number,
			default: 0,
		},
		createdBy: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);
// recipeSchema.index({
// 	name: 'text',
// });

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const createToken = (user, secret, expiresIn) => {
	const { username, email } = user;

	return jwt.sign({ username, email }, secret, { expiresIn });
};
const Recipe = require('./models/recipesModel');
exports.resolvers = {
	Query: {
		getAllRecipes: async (root, args, { Recipe }) => {
			const allRecipes = await Recipe.find().sort({ createdDate: 'desc' });
			return allRecipes;
		},
		getCurrentUser: async (root, args, { currentUser, User }) => {
			if (!currentUser) {
				return null;
			}
			const user = await User.findOne({
				username: currentUser.username,
			}).populate({
				path: 'favorites',
				fields: '_id name',
			});
			return user;
		},
		getRecipe: async (root, { _id }, { Recipe }) => {
			console.log(_id);
			const recipe = await Recipe.findOne({ _id });
			return recipe;
		},
		searchRecipes: async (root, { searchTerm }, { Recipe }) => {
			console.log({ searchTerm });
			const userPattern = new RegExp('^' + searchTerm);
			if (searchTerm) {
				const searchResults = await Recipe.find(
					{ name: { $regex: userPattern } }
					// 	{
					// 		$text: { $search: searchTerm },
					// 	},
					// 	{
					// 		score: { $meta: 'textScore' },
					// 	}
					// ).sort({
					// 	score: { $meta: 'textScore' },
					// }
				);
				return searchResults;
			} else {
				const recipes = await Recipe.find().sort({
					likes: 'desc',
					createdDate: 'desc',
				});
				return recipes;
			}
		},
		getUserRecipes: async (root, { username }, { Recipe }) => {
			const userRecipes = await Recipe.find({ createdBy: username }).sort({
				createDate: 'desc',
			});
			return userRecipes;
		},
	},
	Mutation: {
		addRecipe: async (
			root,
			{ name, imageUrl, description, category, instructions },
			{ Recipe, currentUser }
		) => {
			const createdBy = currentUser.username;
			console.log(createdBy);
			const newRecipe = await new Recipe({
				name,
				imageUrl,
				description,
				category,
				instructions,
				createdBy,
			}).save();
			return newRecipe;
		},
		signupUser: async (root, { username, email, password }, { User }) => {
			const user = await User.findOne({ username });
			if (user) {
				throw new Error('user already exist');
			}
			const newUser = await new User({
				username,
				email,
				password,
			}).save();
			return { token: createToken(newUser, process.env.SECRET, '1hr') };
		},
		loginUser: async (root, { username, password }, { User }) => {
			const user = await User.findOne({ username });
			if (!user) {
				return new Error('you are not registed');
			}
			const isValidPassword = await bcrypt.compare(password, user.password);
			if (!isValidPassword) {
				throw Error('invalid Password');
			}
			return {
				token: createToken(user, process.env.SECRET, '10d'),
			};
		},
		deleteUserRecipe: async (root, { _id }, { Recipe }) => {
			const deletedRecipe = await Recipe.findOneAndDelete({ _id });
			return deletedRecipe;
		},
		likeRecipe: async (root, { _id, username }, { Recipe, User }) => {
			console.log(_id);
			const recipe = await Recipe.findOneAndUpdate(
				{ _id },
				{ $inc: { likes: 1 } }
			);
			const user = await User.findOneAndUpdate(
				{ username },
				{
					$push: {
						favorites: _id,
					},
				},
				{ new: true }
			);
			if (!user) {
				return Error('fail ', 404);
			}
			return recipe;
		},
		unlikeRecipe: async (root, { _id, username }, { Recipe, User }) => {
			const recipe = await Recipe.findOneAndUpdate(
				{ _id },
				{ $inc: { likes: -1 } }
			);
			const user = await User.findOneAndUpdate(
				{ username },
				{
					$pop: {
						favorites: 1,
					},
				}
			);
			return recipe;
		},
		editRecipe: async (
			root,
			{ _id, name, imageUrl, description, category },
			{ Recipe }
		) => {
			const recipe = await Recipe.findOneAndUpdate(
				{
					_id,
				},
				{ name, imageUrl, description, category },
				{ new: true }
			);
			return recipe;
		},
	},
};

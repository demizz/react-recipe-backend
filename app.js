const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Recipe = require('./models/recipesModel');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');

const User = require('./models/usersModel.js');
const { typeDefs } = require('./schema');
const { resolvers } = require('./resolvers');
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const schema = makeExecutableSchema({
	typeDefs: typeDefs,
	resolvers: resolvers,
});

app.use(cors());
app.use(express.static(path.join('public')));

app.use(async (req, res, next) => {
	let token;

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith('Bearer')
	) {
		token = req.headers.authorization.split(' ')[1];
	}
	if (token !== 'null' && token !== undefined) {
		try {
			console.log({ token });
			const currentUser = await jwt.verify(token, process.env.SECRET);
			console.log({ currentUser });
			req.currentUser = currentUser;
		} catch (err) {
			console.log(err);
		}
	}

	console.log(token);
	next();
});
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));
app.use(
	'/graphql',
	bodyParser.json(),
	graphqlExpress(({ currentUser }) => ({
		schema,
		context: {
			Recipe,
			User,
			currentUser,
		},
	}))
);

app.use((req, res, next) => {
	res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

module.exports = app;

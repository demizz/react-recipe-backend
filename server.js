const app = require('./app');
const PORT = process.env.PORT || 4000;

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const DB = process.env.DATABASE.replace(
	'<password>',
	process.env.DATABASE_PASSWORD
);
mongoose
	.connect(DB, {})
	.then(() => {
		console.log('connection to database successfully');
	})
	.catch((err) => console.log(err));
app.listen(PORT, () => {
	console.log(`server running at port ${PORT}`);
});

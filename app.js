const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const Recipe=require('./models/recipesModel');
const jwt=require('jsonwebtoken');
const cors=require('cors');

const User=require('./models/usersModel.js');
const {typeDefs}=require('./schema');
const {resolvers}=require('./resolvers');
const {graphiqlExpress,  graphqlExpress}=require('apollo-server-express');
const {makeExecutableSchema}=require('graphql-tools'); 
const schema=makeExecutableSchema({
    typeDefs:typeDefs,
    resolvers:resolvers
})
const corsOptions={
    origin:'http://localhost:3000',
    credentials:true

}
app.use(cors(corsOptions));
app.use(async(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1];
    if(token!=='null'){
        try{
            console.log({token});
            const currentUser=await jwt.verify(token,process.env.SECRET)
            console.log({currentUser});
            req.currentUser=currentUser;
        }catch(err){
            console.log(err)
        }
    }

    console.log(token);
    next();

});
app.use('/graphiql',graphiqlExpress({endpointURL:'/graphql'}))
app.use('/graphql',bodyParser.json(),graphqlExpress(({currentUser})=>({
    schema,
    context:{
        Recipe,User,currentUser
    }
})))
module.exports=app;
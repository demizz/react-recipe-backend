exports.typeDefs = `
type Recipe{
    _id:ID
    name:String!
    imageUrl:String!
    category:String!
    description:String!
    instructions:String!
    createdDate:String
    likes:Int
    createdBy:String
}


type User{
    _id:ID
    username:String! @unique
    password:String!
    email:String!
    joinDate:String
    favorites:[Recipe]
}
type Query{
    getAllRecipes:[Recipe]
    getCurrentUser:User
    getRecipe(_id:ID!):Recipe
    searchRecipes(searchTerm:String):[Recipe]
    getUserRecipes(username:String!):[Recipe]
}
type Token{
    token:String!
}

type Mutation{
    addRecipe(name:String!,imageUrl:String!,description:String!,category:String!,instructions:String!,username:String):Recipe

    signupUser(username:String! ,email:String!,password:String!):Token
    loginUser(username:String! ,password:String!):Token
    deleteUserRecipe(_id:ID):Recipe
    likeRecipe(_id:ID,username:String!):Recipe
    unlikeRecipe(_id:ID,username:String!):Recipe
    editRecipe(_id:ID,name:String!,description:String!,category:String,imageUrl:String!):Recipe
}

`;

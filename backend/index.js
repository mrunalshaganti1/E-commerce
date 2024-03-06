const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { request } = require("http");

app.use(express.json());
app.use(cors());

// MongoDB Database Connection
mongoose.connect("mongodb+srv://ecommercedev:ecommercepass@cluster0.h57v8xt.mongodb.net/e-commerce");

//API Endpoint
app.get("/", (request, response)=> {
    response.send("Express App is Running")
});

app.listen(port, (error)=> {
    if(!error){
        console.log("Server running on port "+port);
    }else{
        console.log("Error: "+error);
    }
});

//Image Storage Engine
const storage = multer.diskStorage({
    destination: './upload/images',
    filename:(require, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});

const upload = multer({storage: storage});

//Creating Upload endpoint for images
app.use('/images', express.static('upload/images'));
app.post("/upload", upload.single('product'), (request,response) => {
    response.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${request.file.filename}`,
    });
});

//Data Schema for Products
const Product = mongoose.model("Product",{
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    available: {
        type: Boolean,
        default: true
    },
});

// Schema creating for User model

const Users = mongoose.model('Users', {
    name:{
        type:String,
    },
    email:{
        type:String,
        unique:true,
    },
    password:{
        type:String,
    },
    cartData:{
        type:Object,
    },
    date:{
        type:Date,
        default:Date.now,
    }
});

// Creating Endpoint for user registration
app.post('/signup', async (request, response) => {
    let check = await Users.findOne({email:request.body.email});
    if(check){
        return response.status(400).json({success: false, error:"Existing user found with this email"})
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name:request.body.username,
        email:request.body.email,
        password:request.body.password,
        cartData:cart,
    });

    await user.save();

    const data = {
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data, 'secret_ecom');
    response.json({success:true, token});
});

// Creating Endpoint for Login
app.post('/login', async (request, response) => {
    let user = await Users.findOne({email: request.body.email});
    if(user){
        const passCompare = request.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data,'secret_ecom');
            response.json({success:true, token});
        }else{
            response.json({success:false, error: "Entered Password is Wrong.!!!"});
        }
    }else{
        response.json({success:false, error:"User does not exists.!!!"})
    }
})

// Creating Endpoint for cart
app.get('/newcollections', async (request, response) =>{
    let products = await Product.find({});
    let newCollection = products.slice(1).slice(-8);

    console.log("New Collection Fetched");
    response.send(newCollection);
})

// Creating Endpoint for popular in women section
app.get('/popularInWomen',async (request,response) => {
    let products = await Product.find({category: "women"})

    let popular_in_women = products.slice(0,4);

    console.log("Popular in Women fetch");
    response.send(popular_in_women);
})

// Creating Middleware to fetch user
const fetchUser = async (request, response, next) => {
    const token = request.header('auth-token');
    if (!token) {
        response.status(401).send({errors: "Please authenticate using valid token"});
    }else{
        try {
            const data = jwt.verify(token,'secret_ecom');
            request.user = data.user;
            next();
        } catch (error) {
            response.status(401).send({errors:"Please authenticate using a valid token"});
        }
    }
}

// Creating endpoint for adding products in cart data
app.post('/addtocart',fetchUser, async (request,response) => {
    console.log("Added", request.body.itemId);

    let userData = await Users.findOne({_id: request.user.id});
    userData.cartData[request.body.itemId] += 1;
    await Users.findOneAndUpdate({_id: request.user.id}, {cartData:userData.cartData});
    response.send("Added")
})

// Creating Endpoint to remove product from cart
app.post('/removefromcart', fetchUser, async (request,response) => {
    console.log("Removed", request.body.itemId);
    let userData = await Users.findOne({_id: request.user.id});
    if(userData.cartData[request.body.itemId] > 0)
    userData.cartData[request.body.itemId] -= 1;
    await Users.findOneAndUpdate({_id: request.user.id}, {cartData:userData.cartData});
    response.send("Removed")
})


// Creating Endpoint to get cart
app.post('/getcart', fetchUser, async (request, response) =>{
    console.log("Get Cart");
    let userData = await Users.findOne({_id:request.user.id});
    response.json(userData.cartData);
})

app.post('/addproduct', async (request, response)=> {
    let products = await Product.find({});
    let id;
    if(products.length > 0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }else{
        id = 1;
    }
    const product = new Product({
        id: id,
        name: request.body.name,
        image: request.body.image,
        category: request.body.category,
        new_price: request.body.new_price,
        old_price: request.body.old_price,
        description: request.body.description,
    });
    console.log(product);
    await product.save();
    console.log("Saved!!");
    response.json({
        success: true,
        name: request.body.name
    });
});

//Createing API for Delete
app.post('/removeproduct', async (request, response) => {
    await Product.findOneAndDelete({id: request.body.id});
    console.log("Removed!!");
    response.json({
        success: true,
        name: request.body.name
    })
});

//Creating API for Getting All Products
app.get('/allProducts', async (request,response) => {
    let products = await Product.find({});
    console.log("All Products Feteched");
    response.send(products);
})
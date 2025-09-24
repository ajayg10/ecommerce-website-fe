import express from 'express';
import  jwt from 'jsonwebtoken';
import { connectDB } from './db.js';
import {User} from './schema.js';
import { Product } from './schema.js';
import { Cart } from './schema.js';
import { Order } from './schema.js';
const SECRET_KEY = "ajay@123";
const Server = express();


Server.use(express.json());

Server.get('/', (req, res) => {
  res.send('Home route is running');
})



Server.post('/register', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        await User.create({ 
            name : name,
            email : email,
            password : password,
            role : role
        })
        res.json({
            message : "User registered successfully",
            name
        })
    } catch (error) {
        res.status(500).json({
            message : "Error in registering user",
            error
        })
    }
})



Server.get('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email : email, password : password});

   try {
        if(!user){
        res.status(401).json({
            message : "User not found"
        })
    }
    if(user.password !== password){
        res.status(401).json({
            message : "Invalid Password"
        })
    }
     if(user && user.password === password){
        const token = jwt.sign({id: user._id, name : user.name}, SECRET_KEY, {expiresIn : "1h"});
      
      res.json({
         message : "User Logged in Successfully",
         token,
         user : {
             id : user._id,
             name : user.name,
             email : user.email,
             role : user.role    
         }
     })
    }
   } catch (error) {
        res.status(500).json({
            message : "Server error",
            error
        })
   }
})



Server.use((req, res, next) => {
    const token = req.headers.authorization;
    if(token){
      try {
          const decoded = jwt.verify(token, SECRET_KEY);
          if(decoded){
              console.log({"User Logged in" : decoded.name});
              req.user = decoded;
              next();
          }else{
              res.status(401).json({
                  message : "Invalid Token"
              })
      }} catch (error) {
            res.status(401).json({
                  message : "Invalid Token"
              })  
      }
    }else{
        res.status(401).json({
            message : "No Token Provided"
        })
    }
})




Server.get('/profile', (req, res) => {
    res.send({
        message : "User Profile",
        user : req.user.name,
        email : req.user.email,
        role : req.user.role
    });
})





Server.post('/add_products', async (req,res) => {
     const {name, price, category} = req.body;

        if(User.role == "seller"){
            try {
                await Product.create({
                    name : name,
                    price : price,
                    category : category
                })
                res.json({
                    message : "Product added Successfully",
                    name,
                    price
                })
            } catch (error) {
                res.status(500).json({
                    message : "Error in adding product",
                    error
                })        
        }
    }
})
    

 Server.get('/products', async (req, res) => {
     try {
        const { sellerId } = req.body; 

        if (sellerId) {
            const products = await Product.find({ sellerId })
            res.json({ products })
        }else{
            res.status(400).json({ message: "sellerId is required" });
    } 
        }catch (error) {
            res.status(500).json({ message: "Error fetching products", error });
            }
    });



Server.get('/all_products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json({ products })
    } catch (error) {
        res.status(500).json({ message: "Error fetching products", error });
    }
});



Server.post('/add_to_cart', async (req, res) => {
    const {ProductId , quantity} = req.body;

   try {
     let cart = await cart.findOne({userId : req.user._id});
 
     if(!cart){
         let cart = new Cart({userId : req.user._id, cartItems : []});
     
     
     cart.push({ProductId, quantity});
     res.json({
         message : "Product added to cart",
         cart
     })
    }
   } catch (error) {
        res.status(500).json({
            message : "Error in adding to cart",
            error
        })  
    }
})



Server.get('/view_cart', async (req, res) => {
    try {
        const cart = await Cart.findOne({userId : req.user._id})
        res.json( cart || {message :"cart is empty"})
    } catch (error) {
        res.status(500).json({
            message : "Error in fetching cart",
            error
        })  
        //sum of the prices of all items in the cart
    }
})



Server.post('/place_order', async (req, res) => {
    const {items} = req.body;
    try {
        await Order.create({
            userId : req.user._id,
            items : items
        })
        res.json({
            message : "Order placed successfully"
        })
    } catch (error) {
        res.status(500).json({
            message : "Error in placing order", 
            error
        })
    }
})




Server.get('/view_orders', async (req, res) => {
    try {
        const orders = await Order.find({userId : req.user._id}).populate("items.productId", "name price");
        res.json({orders})
    } catch (error) {
        res.status(500).json({
            message : "Error in fetching orders",
            error
        })  
    }
})




Server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    connectDB();
})
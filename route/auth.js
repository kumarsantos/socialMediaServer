const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt =require('jsonwebtoken')
const User = mongoose.model("User");
const {JSON_SECRET}=require('../key')
const requireLogin=require('../Middleware/requireLogin')




router.get("/protected",requireLogin, (req, res) => {
    res.send("hello")
});

router.post("/signup", (req, res) => {
  
  const { name, email, password } = req.body;
  
  if (!email || !password || !name) {
    return res.status(422).send({ error: "Please Enter all the Field" });
  }
  User.findOne({ email: email })
    .then((saveduser) => {
      if (saveduser) {
        return res
          .status(422)
          .json({ error: "User already exist with this email" });
      }
      const saltRounds = 10;
      bcrypt.hash(password, saltRounds).then((hashpassword) => {
        const user = new User({
          email,
          password: hashpassword,
          name,
        });

        user
          .save()
          .then((user) => {
            res.json({ message: "Register Successfully" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => console.log(err));
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please Enter all field" });
  }
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({ error: "Invalid email or password" });
      }

      bcrypt.compare(password, user.password).then((doMatch) => {

        if (doMatch) {
        //   res.json({ message: "Successfully Signed In" });
        const token=jwt.sign({_id:user._id},JSON_SECRET)

        const loggeduser={_id:user._id,email:user.email,username:user.name,followers:user.followers,following:user.following}
        res.json({token,loggeduser})


        } else {
          res.json({ error: "Invalid email or Password" });
        }
      });
    })
    .catch((err) => console.log(err));
}); 

module.exports = router;

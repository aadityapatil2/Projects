
const UserModel = require("../models/userModel");
const jwt = require("jsonwebtoken");

const createUser = async function(req,res){
    try{
        let data = req.body;
        const{title,name,phone,email,password}=data //Destructuring

        if(!Object.keys(data).length)return res.send({status:false,msg:"Enter some data"})

        //title validation
        if(!title)return res.status(400).send({status:false,msg:"title is mandatory"})
        if(title!= "Mr" && title!= "Mrs" && title!= "Miss")return res.status(400).send({status:false,msg:`title can contain only "Mr","Mrs" os "Miss"`})

        //Name validation
        if(!name)return res.status(400).send({status:false,msg:"name is mandatory"})
        if(!(/^[a-zA-Z\. ]*$/).test(name))return res.status(400).send({status:false,msg:"name is not valid"})

        //Phone validation
        if(!phone)return res.status(400).send({status:false,msg:"phone is mandatory"})
        if(!(/^[\s]*[6-9]\d{9}[\s]*$/gi).test(phone)){
            return res.status(400).send({status:false,msg:"phone number is invalid "})
        }
        let phoneCheck= await UserModel.findOne({phone:phone})
        if(phoneCheck)return res.status(400).send({status:false,msg:"phone number is already used"})

        //Email validation
        if(!email)return res.status(400).send({status:false,msg:"email is mandatory"})
        if(!(/^[a-z0-9_]{3,}@[a-z]{3,}[.]{1}[a-z]{3,6}$/).test(email)) {
            return res.status(400).send({status: false , message: "Email is invalid"})
        }
        let emailCheck= await UserModel.findOne({email:email})
        if(emailCheck)return res.status(400).send({status:false,msg:"email is already used "})

        //Password validation
        if(!password)return res.status(400).send({status:false,msg:"password is mandatory"})
        if(!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/).test(password)){
            return res.status(400).send({status:false,message:"password is invalid ,it should be of minimum 8 digits and maximum of 15 and should have atleast one special character"})
        }

        let created = await UserModel.create(data)
        res.status(201).send({status:true,data:created})
    }
    catch(err){
        res.status(500).send(err.message)
    }
}

const isValid = function (value) {
    if (typeof value == "undefined" || value == null) return false;
    if (typeof value == "string" && value.trim().length > 0) return true;
  };
  
  const isValidRequestBody = function (object) {
    return Object.keys(object).length > 0;
  };
  
  const isValidEmail = function (email) {
    const regexForEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regexForEmail.test(email);
  };

  
const userLogin = async function (req, res) {

    try { const requestBody = req.body;
  
      if (!isValidRequestBody(requestBody)) {
        return res
          .status(400)
          .send({ status: false, message: "please provide input credentials" });
      }
  
      const userName = requestBody.email;
      const password = requestBody.password;
  
      // validating userName and password
      if (!isValid(userName)) {return res.status(400).send({ status: false, message: "email is required" });}
  
      if (!isValidEmail(userName)) {return res.status(400).send({ status: false, message: "please enter a valid email address" });}
  
      if (!isValid(password)) {return res.status(400).send({ status: false, message: "password is required" });}
  
      if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password)) 
      {return res.status(400).send({status: false,message: "password should be: 8 to 15 characters, at least one letter & one number",});}
  
       const loginUser = await UserModel.findOne({email: userName, password: password,});
  
      if (!loginUser) {return res.status(404).send({ status: false, message: "invalid login credentials" });}
      
  
      const userID = loginUser._id;
      const payLoad = { userId: userID };
      const secretKey = "rass!@#512345ssar767";
  
      // creating JWT
      const token = jwt.sign(payLoad, secretKey, { expiresIn: "100s" });
  
      //res.header("x-api-key", token);
  
      res
        .status(200)
        .send({ status: true, message: "login successful", data: token });

    } catch (err) { res.status(500).send({ error: err.message });}
  };

  module.exports.userLogin = userLogin;


module.exports={createUser, userLogin}


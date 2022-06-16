const Users = require("../data/userData");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  //1. if user exsist
  let found = Users.find((user) => user.username == req.body.username);
  // Users.find({username:req.body.username})
  if (found == null) {
    return res.status(400).json({ message: "user not found" });
  }
  //2. user password === req.body.password
  if (found.password != req.body.password) {
    return res.status(400).json({ message: "Wrong Password" });
  }
  //3. JWT TOKEN
  let token = await jwt.sign(
    {
      username: found.username,
      role: found.role,
    },
    "secret",
    { expiresIn: "1h" }
  );

  res.status(200).json({ token });
};

exports.admin = (req, res) => {
  res.status(200).json({ message: "this is admin" });
};
exports.hr = (req, res) => {
  res.status(200).json({ message: "this is hr" });
};

exports.protect = async (req, res, next) => {
  //1. check the token
  if (req.headers.token == null) {
    return res.status(401).json({ message: "Please log in first" });
  }
  //2. token valid
  let verify = await jwt.verify(req.headers.token, "secret");

  req.user = verify;
  next();
};

exports.checkRole = (...role) => {
  console.log(role);
  return (req, res, next) => {
    if (req.user.role != role) {
      return res.status(401).json({ message: "You must dont have access" });
    }
    next();
  };
};

exports.forgotPassword = (req, res) => {
    let found = Users.find((user) => user.username == req.body.username);
    //1. check user exists
    if(found==null){
        res.status(400).json({message:"user not found"})
    }
    //2.token
    let token = await jwt.sign(
        {
          username: found.username,
        },
        "secret",
        { expiresIn: "15m" }
      );


    //3.send email
    let link = `https://www.something.com/forgotPassword/${token}`
};


exports.changePassword=async (req,res)=>{
    //1. checked token valid
    let verify = await jwt.verify(req.params.token, "secret");

    //2. checked password match
    if(req.body.password != req.body.confirmpassword){
        return res.status(400).json({message:"password dont match"})
    }

    //3. Chaged in database
    verify.username
    Users.updateOne({username:verify.username},{password:req.body.password})
    res.status(200).json({message:"changed password"})
}
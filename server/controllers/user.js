const User = require('../models/User');

exports.updateUser = async (req,res,next)=>{
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
   
   return res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
exports.deleteUser = async (req,res,next)=>{
  try {
    await User.findByIdAndDelete(req.params.id);
   
   return res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
exports.getUser = async (req,res,next)=>{
  try {
    const user = await User.findById(req.params.id).select('-password');
   
   return res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
exports.getUsers = async (req,res,next)=>{
  try {
    const users = await User.find().select('-password');
   
   return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}
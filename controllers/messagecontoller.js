const Message = require('../models/MessageModel.js');
const User = require('../models/UserModel.js');
const cloudinary = require("../lib/cloudinary.js");
const { getReceiverSocketId, io } = require("../lib/socket.js");
const multer = require("multer");
const upload = multer({ dest: "uploads/" }); // Temporary storage

const getUsersForSidebar = async (req, res) => {
    try {
      const loggedInUserId = req.user._id;
      const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
  
      res.status(200).json(filteredUsers);
    } catch (error) {
      console.error("Error in getUsersForSidebar: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
  };

const getMessages = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const myId = req.user._id;
  
      const messages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      });
  
      res.status(200).json(messages);
    } catch (error) {
      console.log("Error in getMessages controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
    }
};

const sendMessage = async (req, res) => {
  try {
      const { text, image, file } = req.body; // file can be for pdf, docx, video, etc.
      const { id: receiverId } = req.params;
      const senderId = req.user._id;

      let imageUrl;
      let fileUrl;

      // Handle image upload
      if (image) {
          // Upload base64 image to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(image, {
              resource_type: 'image', // ensure image is recognized
          });
          imageUrl = uploadResponse.secure_url;
      }

      // Handle file upload (PDF, DOCX, Video, etc.)
      if (file) {
          // Upload file to Cloudinary
          const uploadResponse = await cloudinary.uploader.upload(file, {
              resource_type: 'auto', // This auto-detects the file type (image, pdf, video, etc.)
          });
          fileUrl = uploadResponse.secure_url;
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image: imageUrl, // if there's an image
        file: fileUrl, // if there's a file
    });
    
    await newMessage.save();
    
    // Fetch sender details (assuming you have a User model)
    const sender = await User.findById(senderId, "fullName"); // Fetch only the name field
    
    // Notify the receiver (if they are online) about the new message
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", {
            ...newMessage._doc, // Spread the message details
            senderName: sender.fullName, // Add senderName
        });
    }
    
      console.log(newMessage.senderName);
      console.log(sender.fullName);
      res.status(201).json(newMessage);
  } catch (error) {
      console.log("Error in sendMessage controller: ", error.message);
      res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
    getUsersForSidebar,
    getMessages,
    sendMessage,
}
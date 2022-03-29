const db = require("../database/models/");
const dotenv = require("dotenv");
const aws = require("aws-sdk");
dotenv.config();
const multer = require("multer");
const { File } = db;

class uploadController {
  //method to upload file and insert in the DB
  static async uploadMyFile(req, res) {
    console.log("body ", req.body);
    console.log("files ", req.files);
    console.log("file ", req.file);
    if (!req.file) return res.send("Please upload a file");

    try {
      //Upload file to S3
      const newObj = await File.create({
        fileName: req.file.originalname,
        fileLink: req.file.location,
      });

      //Insert file name and link in DB

      // Return error of success msg
      res.status("201").json({ success: true, message: "Upload success!" });
    } catch (error) {
      console.log("ERROR", error);
      return res
        .status("500")
        .json({ errors: { error: "Files not found", err: error.message } });
    }
  }

  //method to return files in the DB
  static async getFiles(req, res) {
    //Code to get all files from DB and return them
    const allFiles = await File.findAll();
    return res.status("200").json({ success: true, data: allFiles });
  }
}

module.exports = uploadController;

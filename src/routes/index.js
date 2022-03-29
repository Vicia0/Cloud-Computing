const express = require("express");
const aws = require("aws-sdk");

const dotenv = require("dotenv");
const router = express.Router();
dotenv.config();
const multerS3 = require("multer-s3");

const multer = require("multer");
const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

//var bucketParams = {Bucket: process.env.AWS_BUCKET_NAME};

//s3.getBucketAcl(bucketParams, function(err, data) {
// if (err) {
//   console.log("Error", err);
// } else if (data) {
//   console.log("Success", data.Grants);
//  }
//});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      console.log(file);
      cb(null, Date.now().toString()); //use Date.now() for unique file keys
    },
  }),
});
const uploadController = require("../controllers/uploadController");

router.get("/", (_, res) => res.send("Welcome to S3 File Uploader"));
router.post("/upload", upload.single("file"), uploadController.uploadMyFile);
router.get("/files/", uploadController.getFiles);

module.exports = router;

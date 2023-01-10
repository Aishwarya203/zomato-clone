import express from "express";
import AWS from "aws-sdk";
import multer from "multer";

import { ImageModel } from "../../database/allModels";

import {S3upload} from "../../utilis/S3";

const Router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({storage});

/**
 * Route :   /:_id
 * Desc  :   Get image based on their IDS
 * params:   _id
 * Access:   Public
 * Method:   GET
 */
Router.get("/:_id",async(req,res) => {
    try {
        const image = await ImageModel.findById(req.params._id);
        return res.json({image});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/**
 * Route :   /images
 * Desc  :   upload given image to s3 n db
 * params:   none
 * Access:   Public
 * Method:   post
 */
Router.post("/",upload.single("file"),async(req, res) => {
    try {
      const file = req.file;

      const bucketOption = {
        Bucket: "zomato-clone",
        Key:file.Originalname,
        Body:file.buffer,
        ContentType:file.mimetype,
        ACL:"public-read",
      };

      const uploadImage = await S3upload(bucketOptions);
     
      const dbUpload = await ImageModel.create({
        images:[
            {
            Location: uploadImage.Location,
            }
        ]
      })

      return res.status(200).json({ uploadImage});
    } catch(error){
        return res.status(500).json({error: error.message});
    }
})


export default Router;
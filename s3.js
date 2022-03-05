import S3 from 'aws-sdk/clients/s3.js';
import dotenv from 'dotenv';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
});

//upload to s3
const uploadFile = (files) => {
    const Data = [];
    
    files.file.forEach(file => {
        const fileStream = fs.createReadStream(file.path);
        const fileName = `bucketFolder/${uuidv4()}`;
        const uploadParams = {
            Bucket: bucketName,
            Body: fileStream,
            Key: fileName,
        };
        Data.push(s3.upload(uploadParams).promise());
    });
    
    return Promise.all(Data);
}

//get from s3
const getFile = (fileKey) => {
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName,
    };

    return s3.getObject(downloadParams).createReadStream();
}

export default {
    uploadFile,
    getFile,
}
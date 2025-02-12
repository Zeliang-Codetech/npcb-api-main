import S3 from "aws-sdk/clients/s3.js";
import fs from "fs";
const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;
console.log(bucketName, region, accessKeyId, secretAccessKey);
const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

function uploadS3File(file) {
  const fileStream = fs.createReadStream(file.path);
  const uploadpayload = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  return s3.upload(uploadpayload).promise();
}

function getFileStream(fileKey) {
  const downloadpayload = {
    Key: fileKey,
    bucket: bucketName,
  };
  return s3.getObject(downloadpayload).createReadStream();
}

function deleteS3File(filename) {
  // console.log("deleteS3File ", filename);
  if (filename) {
    s3.deleteObject(
      { Bucket: process.env.AWS_BUCKET_NAME, Key: filename },
      function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      }
    );
  }
}

const deleteS3Files = (files) => {
  try {
    if (!files?.length > 0) throw Error("No files found to delete");
    const keys = files.map((file) => ({ Key: file.key }));
    // var objects = [];
    // for (var k in files) {
    //   objects.push({ Key: files[k].key });
    // }
    s3.deleteObjects(
      {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: {
          Objects: keys,
        },
      },
      function (err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      }
    );
  } catch (error) {
    console.log(error.message);
  }
};

export { s3, uploadS3File, getFileStream, deleteS3File, deleteS3Files };
// region: process.env.AWS_BUCKET_REGION,
// accessKeyId: process.env.AWS_ACCESS_KEY,
// secretAccessKey: process.env.AWS_SECRET_KEY,

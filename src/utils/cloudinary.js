import {v2 as cloudinary} from 'cloudinary'

import fs from 'fs'

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


//  do it tommorow Morning !!

const uploadFilesOnCloudinary = async function(localFilePath){
    try {
        
        if (!localFilePath) return console.log('Unavailable to get file Path');

        // File Uploading with cloudinary : 
        const uploadinFile = await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
        })

        console.log("The File is Uploaded Successfullt",uploadinFile.url);
        return uploadinFile;
    } catch (error) {
        // if file is not uploaded or there is problem in file path 
        // and if the file is present in the server and didn't got upload for many reason then its just a garbage so the file has to be remove 

        fs.unlink(localFilePath) //removed the file from the server which was failed for uploading
        return null
    }
}


export  {uploadFilesOnCloudinary};
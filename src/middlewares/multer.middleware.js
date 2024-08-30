import multer from "multer";

// we are using disk Storage for Storing the files 

// * Read about multer thorugh its multer documentation :

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  export  const upload = multer({ storage })
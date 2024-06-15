const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "../client/dbimages")
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({storage: storage});


module.exports = { multer, storage, upload}



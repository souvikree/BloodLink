const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../../config/cloudinary");

//// -----------------------------------------
// Excel Uploads
//// -----------------------------------------
const excelStorage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    return {
      folder: 'bloodlink/excels',
      resource_type: 'raw',
      format: ext,
      public_id: file.originalname.split('.')[0],
    };
  },
});

const uploadExcel = multer({ 
  storage: excelStorage,
  fileFilter: (req, file, cb) => {
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      return cb(new Error('Only Excel files are allowed'), false);
    }
    cb(null, true);
  }
});

//// -----------------------------------------
// Prescription Uploads
//// -----------------------------------------
const prescriptionStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bloodlink/prescriptions',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

const uploadPrescription = multer({ storage: prescriptionStorage });


//// -----------------------------------------
// License Uploads (PDF/Image)
//// -----------------------------------------
const licenseStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'bloodlink/licenses',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

const uploadLicense = multer({ 
  storage: licenseStorage,
  fileFilter: (req, file, cb) => {
    const allowed = ['jpg', 'jpeg', 'png', 'pdf'];
    const ext = file.originalname.split('.').pop().toLowerCase();
    if (!allowed.includes(ext)) {
      return cb(new Error("Only PDF or image files are allowed"), false);
    }
    cb(null, true);
  }
});

module.exports = {
  uploadExcel,
  uploadPrescription,
  uploadLicense
};



// const multer = require("multer");
// const path = require("path");

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/");
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const fileFilter = (req, file, cb) => {
//   const ext = path.extname(file.originalname);
//   if (ext !== ".xlsx" && ext !== ".xls") {
//     return cb(new Error("Only Excel files are allowed"));
//   }
//   cb(null, true);
// };

// module.exports = multer({ storage, fileFilter });

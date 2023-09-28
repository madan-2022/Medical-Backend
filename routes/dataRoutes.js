const express = require('express');
const router = express.Router();
const CombinedData = require('../models/Combinedata');
const multer = require('multer');
 
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads1/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post('/uploadData',upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 }]), async (req, res) => {
  try {
    const {
      universityDescription,
      collegename,
      established,
      collegetype,
      location,
      approval,
      address,
      state,
      city,
      affiliatedby,
      collegecategory,
      courses,
      cutoffdata,
      website,
      mail,
      image1,
      image2
    } = req.body;
    console.log(req.body)
   

    console.log(image1)
    

    


    const combinedData = new CombinedData({
      universityDescription,
      collegename,
      established,
      collegetype,
      location,
      approval,
      address,
      state,
      city,
      affiliatedby,
      collegecategory,
      courses, // Parse courses as JSON
      cutoffdata,
      website,
      mail,
      image1,
      image2
    });

    await combinedData.save();

    res.status(200).json({ message: 'Data added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;

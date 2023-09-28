const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const multer = require('multer');
const University = require('./models/University');
const Universitydes=require('./models/Universitydescription')
const dataRoutes=require('./routes/dataRoutes')
const CombinedData=require('./models/Combinedata')
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
app.use('/uploads', express.static('uploads'));

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

mongoose.connect('mongodb://127.0.0.1:27017/Medical', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

  

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post('/api/universities', upload.single('logo'), async (req, res) => {
  try {
    const { name, courses, state , location, fees } = req.body;

    const logoUrl = req.file ? `/uploads/${req.file.filename}` : '';

    const university = new University({
        name: req.body.name,
        courses: req.body.courses,
        state: req.body.state,
        location:req.body.location,
        fees: req.body.fees,

        logoUrl: logoUrl,
      });

    await university.save();
    res.status(200).json({ message: 'University added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/universities/:state', async (req, res) => {
    try {
      const state = req.params.state.replace('%20', ' '); // Replace %20 with space
      console.log('Fetching universities for state:', state); // Add this line
      const universities = await University.find({ state });
      console.log('Fetched universities:', universities); // Add this line
      res.status(200).json(universities);
    } catch (error) {
      console.error('Error fetching universities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });





  app.get('/api/colleges/:course', async (req, res) => {
    try {
      const course = req.params.course.replace('%20', ' '); // Replace %20 with space
      console.log('Fetching universities for state:', course); // Add this line
      const universities = await University.find({courses: { $regex: new RegExp(course, 'i') }});
      console.log('Fetched universities:', universities); // Add this line
      res.status(200).json(universities);
    } catch (error) {
      console.error('Error fetching universities:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  app.get('/api/college/:collegename', async (req, res) => {
    try {
      const collegename = req.params.collegename;
      
      // Fetch data for the specified college
      const collegeData = await CombinedData.findOne({ collegename });
  
      if (!collegeData) {
        return res.status(404).json({ message: 'College not found' });
      }
  
      res.json(collegeData);
    } catch (error) {
      console.error('Error fetching college data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.use('/api', dataRoutes);
  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

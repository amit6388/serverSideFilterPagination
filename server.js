const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); 
const rateLimit = require('express-rate-limit');
const cors=require('cors');
const app = express();

// Middleware
app.use(bodyParser.json());

// const generalLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 1000, // Limit each user to 1000 requests per windowMs
//   message: 'Too many requests from this IP, please try again after an hour'
// });

const ipLimiter = rateLimit({
  windowMs: 9000, // 4 seconds
  max:3, // Limit each IP to 2 requests per windowMs
 message:"you reach limit api access."
});

// Apply rate limiters to all requests
// app.use(generalLimiter);
// app.use(ipLimiter);
app.use(cors() );


 
mongoose.connect('mongodb://localhost:27017/Indore_Task')

// Routes
const userRoutes = require('./users');
app.use('/api/users', userRoutes);


const Item = mongoose.model('instructorregister', new mongoose.Schema({
  name: String,
  email: String,
  contact: String,
  password:String
}));

// Home route
app.get("/", async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  let queryParams = {}; 
  
  for (let key in req.query) {
    if (req.query.hasOwnProperty(key) && req.query[key] && key !== 'page' && key !== 'limit') {
      queryParams[key] = { $regex: `^${req.query[key]}`, $options: 'i' }; // Case-insensitive, starts with
    }
  }

  try {
    const items = await Item.find(queryParams)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalItems = await Item.countDocuments(queryParams);
    const totalPages = Math.ceil(totalItems / limit);

    res.send({
      currentPage: parseInt(page),
       message:"Hi from amit",
      totalPages,
      totalItems,
      items,
      queryParams
     
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// uiytuidui dfghf ghdf ruitheuir////
// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 
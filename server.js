 
const rateLimit = require('express-rate-limit');  
const ipLimiter = rateLimit({
  windowMs: 9000, // 4 seconds
  max:3, // Limit each IP to 2 requests per windowMs
 message:"you reach limit api access."
}); 
 
 
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
  
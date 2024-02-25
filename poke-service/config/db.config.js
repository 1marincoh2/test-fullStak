const mongoose = require('mongoose');
require('dotenv').config()
mongoose.connect(process.env.MOMGODB_URI)

.then(db=>console.log('Database is connceted'))
.catch(err=>console.log(err));

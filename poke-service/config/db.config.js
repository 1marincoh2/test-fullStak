const mongoose = require('mongoose');
require('dotenv').config()



mongoose.connect(process.env.MOMGODB_URI
//     {
//     useNewUrlParser:true,
//     useUnifiedTopology:true,
//     family: 4 // Use IPv4, skip trying IPv6

// }
)

.then(db=>console.log('Database is connceted'))
.catch(err=>console.log(err));

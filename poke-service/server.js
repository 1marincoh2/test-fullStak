
const express = require('express');
const app = express();

//Connection
require('./config/db.config')

const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200
}

const pokemonRoutes = require('./routes/pokemonRoutes');
const coachRouters=require('./routes/coachRoutes')


app.use(express.json());
app.use(cors(corsOptions));

//middleware
app.use('/api', pokemonRoutes,coachRouters);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

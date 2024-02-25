
const express = require('express');
const app = express();
require('./config/db.config')
const cors = require('cors');
const pokemonRoutes = require('./routes/pokemonRoutes');
const coachRouters=require('./routes/coachRoutes')

const corsOptions ={
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200
}



app.use(express.json());
app.use(cors(corsOptions));

app.use('/api', pokemonRoutes,coachRouters);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

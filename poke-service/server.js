
const express = require('express');
const app = express();
const pokemonRoutes = require('./routes/pokemonRoutes');
const cors = require('cors');
const corsOptions ={
    origin:'*', 
    credentials:true,           
    optionSuccessStatus:200
}

app.use(express.json());
app.use(cors(corsOptions));
app.use('/api', pokemonRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

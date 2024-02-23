import axios from 'axios';
// Se crea instancia http con valores default
 const httpInstance = axios.create( {
    baseURL: 'http://localhost:5000/api/'
});

export default httpInstance
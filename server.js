import express from 'express'; 
import cors from 'cors';
const Server = express();


Server.use(express.json());    
Server.use(cors());


Server.get('/', (req, res) => {             // Home route
  res.json({message :'Home route is running'});
})

Server.get('/users', async (req, res) => {
    const users = [
        {id: 1, name: 'Alice'},
        {id: 2, name: 'Bob'},
        {id: 3, name: 'Charlie'}
    ];
    res.json(users);
})       
    

Server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    
})
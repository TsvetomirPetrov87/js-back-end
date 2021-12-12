const express = require('express');

const {PORT} = require('./config/index');
const databaseConfig = require('./config/database');
const expressConfig = require('./config/express');
const routesConfig = require('./config/routes');

// const userService = require('./services/user');

start();

async function start() {
    const app = express();

   await databaseConfig(app);
    expressConfig(app);
    routesConfig(app);
    
    //REMOVE IN THE END
    app.get('/', (req, res) => {
        res.send('Welcome in my application... It works!');
    });
    

    app.listen(PORT, () => {
    console.log(`Application started at http://localhost:${PORT}`);
    });

    //  testAuth();
}

//функция за тестване

// async function testAuth() {
//     try {
//     const result = userService.createUser('Sasho', '123321');
//     console.log(result);

//     const user = await userService.getUserByUsername('sasho');
//     console.log(user);
//     } catch(err) {
//         console.log('Error:', err.message);
//     }
// }

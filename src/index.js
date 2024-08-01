const {server_config,Logger} = require('./config');
const express = require('express');
const LcashRoutes = require('./routes');
const app = express();

app.use('/Lcash',LcashRoutes);

app.listen(server_config.PORT, ()=>{
    console.log(`Server Started at ${server_config.PORT}`);
    Logger.log({
        level:'info',
        message:'Server Up and Running!',
        label:__filename,
        errors:{msg:'something'}
    });
});
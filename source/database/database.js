const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/blockchain-example').then((result) => {
    console.log('database is connected')
}).catch((err) => {
    console.log(err)
});
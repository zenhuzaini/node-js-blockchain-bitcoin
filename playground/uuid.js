const uuid = require('uuid/v1')
const myadress = uuid().split('-').join('')
console.log(myadress)

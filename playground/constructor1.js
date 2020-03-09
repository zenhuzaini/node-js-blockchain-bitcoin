//
const sha256 = require('crypto-js/sha256')
const str = "my name is zen"
console.log(sha256(str).toString())

function Data(name, address) {
    this.name = name
    this.address = address
}

Data.prototype.toStr = function () {
    return `this person's name is ${this.name}, and his address is in ${this.address}`
}

Data.prototype.hashIt = function () {
    return sha256('data : ' + this.name + ' ' + this.address).toString()
}

const data1 = new Data('zen', 'polandia')

console.log(data1)
console.log(data1.address)
console.log(data1.toStr())
console.log(data1.hashIt())
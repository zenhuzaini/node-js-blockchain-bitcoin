const Blockchain = require('../blockchain')

const bitcoin = new Blockchain()

const prevHash = 'wsrethrdyESTJR'
const currentData = [
    {
        amount: 10,
        sender: 'Aku',
        receipient: 'Dia'
    },
    {
        amount: 190,
        sender: 'Aku',
        receipient: 'Dia'
    },
    {
        amount: 1880,
        sender: 'Aku',
        receipient: 'Dia'
    }
]

const nonce = 67897

const newSha = bitcoin.hashBlock(prevHash, currentData, nonce)
console.log(newSha.toUpperCase())
const Blockchain = require('../blockchain')

const bitcoin = new Blockchain()
console.log(bitcoin)

bitcoin.createNewBlock(7, 'rdfghsd576788o4ihre', '4rtyegfuievhkjwrn')
bitcoin.createNewBlock(6878, 'LLLLLLLo4ihre', 'KLOKyegfuievhkjwrn')
bitcoin.createNewBlock(57678, 'IUYUId576788o4ihre', 'KJH4rtyegfuievhkjwrn')

bitcoin.createNewTransaction(200, 'alexsmith', 'janedoe')
bitcoin.createNewBlock(4567, 'hvjbk', 'cgvhjbknl')

//jadi, transaksi saat ini statusnya pending, karena gada miner yang menambang atau create block
//kemudian, transaksi baru bisa dimasukkan kedalam chain apabila ada yang membuat block
//check prototype create block, ada variable untuk nullify transaction


console.log(bitcoin)
console.log(bitcoin.chain[3])

//////
///////////
//try add more transaction
bitcoin.createNewTransaction(7678, 'rdfghsd576788o4ihre', '4rtyegfuievhkjwrn')
bitcoin.createNewTransaction(687834567, 'LLLLLLLo4ihre', 'KLOKyegfuievhkjwrn')
bitcoin.createNewTransaction(576783234, 'IUYUId576788o4ihre', 'KJH4rtyegfuievhkjwrn')

bitcoin.createNewBlock(746578, 'rdfghsd576788o4ihre', '4rtyegfuievhkjwrn')

console.log(bitcoin.chain[4])
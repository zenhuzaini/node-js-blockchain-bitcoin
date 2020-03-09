// class Blockchain {
//     constructor() {
//         this.chain = []
//         this.newTransaction = []
//     }
//     //the mmethods are here
// }

const sha256 = require('crypto-js/sha256')
const currentNodeUrl = process.argv[3]
const uuid = require('uuid/v1') //to get address

function Blockchain() {
    this.chain = []
    this.pendingTransaction = [] // it's kind of a pending transaction before put it ito the chain above
    //when new ransaction is created, it is hanging.but after we create the block it will be saved to the block

    //to get current node
    this.currentNodeUrl = currentNodeUrl
    //to make each node is aware
    this.networkNodes = []

    this.createNewBlock(100, 'PREV-HASH-FROM-GENESIS', 'HASH-FROM-GENESIS')
}

//Create new Block / mining
Blockchain.prototype.createNewBlock = function (nonce, prevBlockHash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransaction, //pending ransactions
        nonce: nonce, // it is a number
        hash: hash,
        prevBlockHash: prevBlockHash
    }

    this.pendingTransaction = [] //to nullify the transaction, it means what is inside the transaction will be inserted to chain and the current Pendingtransaction will be deleted
    this.chain.push(newBlock)
    return newBlock
}

//getlastBlock
Blockchain.prototype.getLastBlock = function () {
    return this.chain.length - 1
}

//new transaction method
//all the transaction is all here
Blockchain.prototype.createNewTransaction = function (amount, sender, recipient) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient,
        transactionId: uuid().split('-').join('')
    }
    return newTransaction

}

Blockchain.prototype.addTransactionToPendingTransaction = function (transaction) {
    this.pendingTransaction.push(transaction)
    return this.getLastBlock() + 1 //it wil only return the index
    //it's the index of the block where pending transaction will be added to the block
}

Blockchain.prototype.hashBlock = function (prevBlockHash, currenBlockData, nonce) { //data that will be hashed //and will return new hash
    //change the data into string
    const datatoString = 'previoushash : ' + prevBlockHash +
        'nonce used : ' + nonce.toString() +
        'data you have : ' + JSON.stringify(currenBlockData)

    const hash = sha256(datatoString).toString()
    return hash
}

//proof of work 
//what makes it important in blockchain
// we want to make sure that every thransacation that is put to the chain is legitimate 
//without PoW  people will be easy spamming new Block
//everytime we create a block, we need to make sure that it is the legitimate block by mining it through PoW

//PoW actually do ?
//it will take current blok data and prev block hash
//repeteadly hash the block until we find the correct hash => '00000FGHJBK*^&%& 
//bicoin.hash(prevhash, newData, nonce) . nonce will be changed always to get the exact hash!

//How PoW really secure the chain ?
//in order to geerate the corret hash, we have to run our hash method many many times.. and it uses computing power and energy

//so it's a mean that how you can find the nonce, how many noce needed if the first 4 character in the hash will be 0000 / 0001
//after that, if you find the nonce, you will be able to push to the block
Blockchain.prototype.proofOfWork = function (previousBlockHash, currenBlockData) {
    let nonce = 0;
    let hash = this.hashBlock(previousBlockHash, currenBlockData, nonce)

    while (hash.substr(0, 3) !== '000') { //it can be = 0,4 !== '0000'
        nonce++
        hash = this.hashBlock(previousBlockHash, currenBlockData, nonce)
        // console.log(hash) //just dont do this lol
    }

    console.log(`this process comes from proofofwork : previousBlockhash: ${previousBlockHash}, currentdata: ${currenBlockData}`)

    return { hash, nonce }
}

//if it's legitinate or not
//it will iterate all the chain and make sure that

//and will see if the data is the correct data by recalcukate hash
Blockchain.prototype.isValid = function (blockchain) {
    let validChain = true
    let blockSummary = []

    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i]
        const prevBlock = blockchain[i - 1]

        //chechk if it it the cprrect data, buy re hashing
        const data = { transaction: currentBlock.transactions, index: currentBlock.index }
        // console.log(data)
        const blockHash = this.hashBlock(prevBlock.hash, data, currentBlock.nonce)
        // console.log(prevBlock.hash)
        // console.log(blockHash)
        if (blockHash.substring(0, 3) !== '000') {
            validChain = false
            blockSummary.push({ block: i, isValid: validChain })
        }

        //will compare the prev blok hash
        if (currentBlock['prevBlockHash'] !== prevBlock['hash']) { //chain is not valid
            validChain = false
            blockSummary.push({ block: i, isValid: validChain })
        }

        if (!validChain) {
            break
        }

    }

    return { blockSummary }
}

module.exports = Blockchain
const Blockchain = require('../blockchain')

const bitcoin = new Blockchain()

const prevHash = 'HGHJJKKLLJKHJGHVHBJNK678GVHB'
const currentData = [
    {
        data: 1,
        sender: 'NONA',
        receipient: 'ALEX'
    }, {
        data: 2,
        sender: 'HJINONA',
        receipient: 'BNMALEX'
    }, {
        data: 3,
        sender: 'HGGFNONA',
        receipient: 'SFDALEX'
    },
]

//trying to find the hash where it will start with 0000
//trying to get the correct nonce
const pow = bitcoin.proofOfWork(prevHash, currentData)

console.log(pow)
//will return : 
//hash: '0000279c8d3990f2ccb958e1ec2f144f3e473f4c4d2738938bfa964dfc8ab070',
//nonce: 52168


//------------------- AFTER THAT once we get the correct nonce, we could use the nonce, to calculate the hash function
const currentHash = bitcoin.hashBlock(prevHash, currentData, pow.nonce)
console.log(currentHash) //will return the same like pow.nonce
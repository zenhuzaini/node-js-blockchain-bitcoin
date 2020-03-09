const express = require('express')
const app = express()
const rp = require('request-promise')

const uuid = require('uuid/v1') //to get address
const nodeAddress = uuid().split('-').join('') //just to remove the dash dash address from uuid

const port = process.argv[2]
// require('../source/database/database')

const Blockchain = require('./blockchain')
const chain = new Blockchain()

app.use(express.json())
// app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
    res.send('welcome to blockchain!')

})

//fetch all the entire chains
app.get('/blockchain', (req, res) => {
    res.send(chain)
})

//Step 1. create new transaction
app.post('/transaction', (req, res) => {
    const newTransaction = req.body

    //transaction that will be added to the block
    const getIndex = chain.addTransactionToPendingTransaction(newTransaction)

    res.json('new transaction wil be added to index : ' + getIndex + ' in the chain, but it will be written: ' + (getIndex + 1))
})

app.post('/transaction/broadcast', (req, res) => {
    const { amount, receipient, sender } = req.body
    const newTransaction = chain.createNewTransaction(amount, sender, receipient)

    //add panding transaction for yourself
    chain.addTransactionToPendingTransaction(newTransaction)

    const savedPromises = []
    //broadcast
    chain.networkNodes.forEach((nodeNetwork) => {
        const requestOption = {
            uri: nodeNetwork + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        }

        //save all the request into promise adn save it into array
        savedPromises.push(rp(requestOption))
    })

    //call all saved promises
    Promise.all(savedPromises).then((result) => {
        res.send({ note: 'it is broadcasted successfully', result })
    })
})


//Step 2. create mining block/ create
app.get('/mine', (req, res) => {
    //get prev data
    const lastBlock = chain.getLastBlock()
    console.log(lastBlock)

    //et hash value
    // const getPrevHash = lastBlock['hash'] it doesn't work like this if the node is only 1
    const getPrevHash = chain.chain.find((result) => {
        return result.index == lastBlock + 1
    }).hash
    console.log('this is theprevious hash : ', getPrevHash)

    //create data 
    const currentData = {
        transaction: chain.pendingTransaction,
        // index: lastBlock['index'] + 2
        index: lastBlock + 2
    }

    console.log('this is the current data : ', currentData)

    //produce of nonce, we must do proof of work
    const nonce = chain.proofOfWork(getPrevHash, currentData).nonce

    //now hash it, once we found the nonc of PoW
    const currentBlockHash = chain.hashBlock(getPrevHash, currentData, nonce)

    //save the block
    const savetoBlock = chain.createNewBlock(nonce, getPrevHash, currentBlockHash)



    //BROADCAST the mined Block
    const requestPromises = []
    chain.networkNodes.forEach((nodes) => {
        const optionsUrl = {
            uri: nodes + '/receive-new-block',
            body: { savetoBlock },
            method: 'POST',
            json: true
        }
        console.log(rp(optionsUrl))
        requestPromises.push(rp(optionsUrl))
    })

    Promise.all(requestPromises).then((result) => {
        //broadcast the new reward
        //once we save it, we must give a reward to whoever sucessfully creates a block! it is in a transaction
        //chain.createNewTransaction(12.5, "00", nodeAddress) //12.5 is the value of BC, "00 : is the sender", receipient is you which representend by UUID
        const broadcastOptionUrl = {
            uri: chain.currentNodeUrl + '/transaction/broadcast',
            method: 'POST',
            body: {
                amount: 100,
                sender: 'Bank Z',
                receipient: nodeAddress
            },
            json: true
        }

        return rp(broadcastOptionUrl)
    }).then((data) => {
        res.send({ getPrevHash, nonce, currentBlockHash, savetoBlock })
    }).catch((err) => {
        return err
    });
})

app.post('/receive-new-block', (req, res) => {
    const newBlock = req.body.savetoBlock

    //check if the previous hash
    const lastBlock = chain.getLastBlock()
    const isValidHash = lastBlock.hash === newBlock.currentBlockHash

    //check if the new blovk must have the correct index
    const isCorrectIndex = lastBlock['index'] + 1 === newBlock['index']

    if (!isValidHash && !isCorrectIndex) {
        return res.send('new block is not legitimate')
    }

    chain.chain.push(newBlock)
    chain.pendingTransaction = []

    res.send('saved to the chain :)')

})





//DECENTRALIZED NEWTWORK

//mengirim ke salah satu node (ex: node1 - localhost:2000) yang sudah tergister (bahwa akan ada node baru yang akan bergabung) kemudian,
//node 1 akan membroadcast ke smua node yang terigstrasi dan memperkenlkan node baru ke semuanode yangada (menggunkan enpoin /register-node)
//register the nod and broadcast the node to th entire network
app.post('/register-and-broadcast-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl;

    const isNodeNew = chain.networkNodes.find((node) => {
        return node == newNodeUrl
    })

    if (!isNodeNew) {
        chain.networkNodes.push(newNodeUrl) //save the new url
    }

    //now time to broadcast the new node / newNodeUrl to the network
    //var to save all the register Nodes
    const registerNodes = []
    chain.networkNodes.forEach((res) => {
        //resgister node
        const requestOption = {
            uri: res + '/register-node',
            method: 'POST',
            body: { newNodeUrl: newNodeUrl }, //the data
            json: true
        }

        registerNodes.push(rp(requestOption))
    })

    //to return all of the promises
    Promise.all(registerNodes).then((result) => {
        //take the bulk
        const bulkRegisterOptions = {
            uri: newNodeUrl + '/register-node-bulk',
            method: 'POST',
            body: {
                allNetworkNodes: [...chain.networkNodes, chain.currentNodeUrl]
            },
            json: true
        }

        return rp(bulkRegisterOptions)

    }).then((result) => {
        res.json({ message: 'new node is registered to network successfully!' })
    }).catch((err) => {
        res.json(err)
    });

})

//register a node with the network
app.post('/register-node', (req, res) => {
    const newNodeUrl = req.body.newNodeUrl //new node url is taken from the body
    //check if it is not the current node
    const isItCurrentNode = chain.currentNodeUrl == newNodeUrl

    //check if the new node is not exist
    const isNewNodeExist = chain.networkNodes.find((res) => {
        return res == newNodeUrl
    })

    if (!isItCurrentNode && !isNewNodeExist) {
        chain.networkNodes.push(newNodeUrl)
        return res.json({ message: 'New Node is registered successfully in the network ...' })
    }

    res.json({ message: 'New Node is not able to be registered, it can be because it is availabe or you eneter the same node ...' })
})

//register multiple nodes at once, jadi setelah endpoin baru diperkenalkan ke endpoin lain, maka
//endpoin yang baru tersebut harus menerima data url dari endpon/node lain yang sudah teregistrasi (menyimpan alamat node lain)

//it will always be hit in every new node exists
app.post('/register-node-bulk', (req, res) => {
    const allNetworkNodes = req.body.allNetworkNodes

    allNetworkNodes.forEach((resNode) => {
        //checck if the node is not present in the new node
        const isThere = chain.networkNodes.find((nodes) => {
            return nodes == resNode
        })

        //check if the current url is not the same with the new inserted url
        const isNetworkTheSame = chain.currentNodeUrl == resNode

        if (!isThere && !isNetworkTheSame) {
            //register each network url to the new node
            chain.networkNodes.push(resNode)
        }


    })

    res.json({ message: 'bulk registration is successfull..' })
})

//consensus
app.get('/consensus', (req, res) => {
    const executeAllPromises = []
    chain.networkNodes.forEach((node) => {
        const requestOption = {
            uri: node + '/blockchain',
            method: 'GET',
            json: true
        }

        executeAllPromises.push(rp(requestOption))
    })

    Promise.all(executeAllPromises)
        .then((result) => {
            const currentNodeChainLength = result.chain.length
            let theLongestChain = currentNodeChainLength
            let newLongestChain = null
            let newPendingTransaction = null

            result.forEach((data) => {
                if (data.chain.length > theLongestChain) {
                    theLongestChain = data.chain.length
                    newLongestChain = data.chain
                    newPendingTransaction = data.pendingTransaction
                }
            })

            //some conditions
            //if there is no longest chain or there is new longest chain but is not valid
            //s we will not not change the chain
            if (!newLongestChain || (newLongestChain && !chain.isValid(newLongestChain))) {
                return res.send({ message: 'chain is not replaced', chain: chain.chain })
            }

            //otherwise there's new longest chain and valid
            chain.chain = newLongestChain
            chain.pendingTransaction = newPendingTransaction

            res.send({ message: 'chain is replaced to the longest chain ...', NewChain: chain.chain })

        }).catch((err) => {

        });
})

app.listen(port, () => {
    console.log('connected to port ', port)
})
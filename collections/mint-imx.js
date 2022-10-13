'use strict';

const ethers = require('ethers');
const { ImmutableXClient } = require('@imtbl/imx-sdk');

module.exports = async function mintImx(collection, tokens, receiverAddress) {

    const privateKey = process.env.PRIVATE_KEY;
    const publicApiUrl = process.env.PUBLIC_API_URL;
    const starkContractAddress = process.env.STARK_CONTRACT_ADDRESS;
    const registrationContractAddress = process.env.REGISTRATION_ADDRESS;

    const provider = new ethers.providers.AlchemyProvider(process.env.ETH_NETWORK, process.env.ALCHEMY_API_KEY);
    const minter = new ethers.Wallet(privateKey).connect(provider);

    const minterClient = await ImmutableXClient.build({
        publicApiUrl,
        signer: minter,
        starkContractAddress,
        registrationContractAddress,
    });
    
    // const tokens = [{
    //     id: mintTokenIdv2,
    //     blueprint: mintBlueprintv2,
    //     // overriding royalties for specific token
    //     royalties: [{                                        
    //         recipient: tokenReceiverAddress.toLowerCase(),
    //         percentage: 3.5
    //     }],
    // }]
    
    const payload = [
        {
            contractAddress: collection.address,
            users: [
                {
                    etherKey: receiverAddress.toLowerCase(),
                    tokens,
                },
            ],
            // globally set royalties
            royalties: [{
                recipient: collection.feeCollectorAddress.toLowerCase(),
                percentage: collection.royaltyFee
            }]
        },
    ];

    const result = await minterClient.mintV2(payload);
    console.log(result);

    return result;
};

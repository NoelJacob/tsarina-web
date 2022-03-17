import TonWeb from "tonweb"
import {tonweb} from "$lib/server"

const {NftCollection, NftItem, NftMarketplace, NftSale} = TonWeb.token.nft;

export class collection {

    constructor(nftCollectionAddress) {
        this.nftCollectionAddress = nftCollectionAddress;
        this.nftCollection = new NftCollection(tonweb.provider, {address: new TonWeb.utils.Address(this.nftCollectionAddress)})
    }

    static deployNftCollection = async (walletAddress, value, royality, collectionContentUri) => {
        const nftCollection = new NftCollection(tonweb.provider, {
            ownerAddress: walletAddress,
            royalty: royality / 100,
            royaltyAddress: walletAddress,
            collectionContentUri: collectionContentUri + '/col.json',
            nftItemContentBaseUri: collectionContentUri,
            nftItemCodeHex: NftItem.codeHex
        });

        const stateInit = (await nftCollection.createStateInit()).stateInit;
        const stateInitBoc = await stateInit.toBoc(false);
        const stateInitBase64 = TonWeb.utils.bytesToBase64(stateInitBoc);

        const nftCollectionAddress = await nftCollection.getAddress();

        return {
            to: nftCollectionAddress.toString(true, true, true),
            value: TonWeb.utils.toNano(value).toString(),
            stateInit: stateInitBase64,
            dataType: 'boc'
        }
    }

    getNftCollectionInfo = async () => {
        const data = await this.nftCollection.methods.getCollectionData();
        const royaltyParams = await this.nftCollection.getRoyaltyParams();

        data.ownerAddress = data.ownerAddress.toString(true, true, true);
        royaltyParams.royaltyAddress = royaltyParams.royaltyAddress.toString(true, true, true);

        console.log(data);
        console.log(royaltyParams);

        return {data, royaltyParams}
    }

    deployNftItem = async (walletAddress, value) => {
        const amount = TonWeb.utils.toNano(value);
        const index = (await this.nftCollection.getCollectionData()).nextItemIndex

        const body = await this.nftCollection.createMintBody({
            amount: amount,
            itemIndex: index,
            itemOwnerAddress: walletAddress,
            itemContentUri: `/${index}/meta.json`
        });
        const bodyBoc = await body.toBoc(false);
        const bodyBase64 = TonWeb.utils.bytesToBase64(bodyBoc);

        return {
            to: this.nftCollectionAddress.toString(true, true, true),
            value: amount.toString(),
            data: bodyBase64,
            dataType: 'boc'
        }
    }

    getNftItemInfoByIndex = async (index) => {
        const nftItemAddress = (await this.nftCollection.getNftItemAddressByIndex(index)).toString(true, true, true);
        console.log(nftItemAddress);

        const nftItem = new NftItem(tonweb.provider, {address: nftItemAddress});
        const nftData = await this.nftCollection.methods.getNftItemContent(nftItem);

        nftData.collectionAddress = nftData.collectionAddress.toString(true, true, true);
        nftData.ownerAddress = nftData.ownerAddress?.toString(true, true, true);

        console.log(nftData);
        return nftData
    }
}


export class nft extends collection {
    constructor(nftAddress, nftCollectionAddress) {
        super(nftCollectionAddress)
        this.nftAddress = nftAddress;
        this.nft = new NftItem(tonweb.provider, {address: new TonWeb.utils.Address(nftAddress)})
    }

    getNftItemInfo = async (nftItemAddress) => {
        console.log('nft item address=', nftItemAddress.toString(true, true, true));

        const data = await super.nftCollection.methods.getNftItemContent(this.nft);

        data.collectionAddress = data.collectionAddress.toString(true, true, true);
        data.ownerAddress = data.ownerAddress?.toString(true, true, true);

        console.log(data);
        return data
    }
}

    // TESTING





// BUTTONS

// $('#createCollectionButton').addEventListener('click', async () => {
//     // 1. make Metadata JSON from user's inputs
//     // 2. host Metadata JSON and content files on marketplace side (like my_collection.json)
//     // 3. deploy NFT Collection smart contract with URI setted to this Metadata JSON file

//     await deployNftCollection();
// });

// $('#createNftButton').addEventListener('click', async () => {
//     // 1. make Metadata JSON from user's inputs
//     // 2. host Metadata JSON and content files on marketplace side (like my_nft.json)
//     // 3. mint NFT smart contract with URI setted to this Metadata JSON file by invoking collection smart contract

//     await deployNftItem();
// });

// try {
//     getInfo();
// } catch (e) {

// }

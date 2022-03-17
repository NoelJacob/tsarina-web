import TonWeb from 'tonweb';
import {nft} from "$lib/nft"

export const post = async ({request}) => {
    try {
        const data = await request.body();

        console.log(data);

        const walletAddress = new TonWeb.utils.Address(data.address)
        const run = await nft.deployNftCollection(walletAddress, data.value, data.royality, data.cid)
        console.log(run);

        return {
            status: 200,
            body: {run}
        }
    }
    catch (error) {
        return {
            status: 500,
            body: {error}
        }
    }
}

// export async function get({request}) {

// }
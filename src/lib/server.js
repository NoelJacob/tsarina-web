import {writable} from "svelte/store";
import TonWeb from "tonweb";

const [net, apiKey] = import.meta.env.VITE_NET === "main" ? ['https://toncenter.com/api/v2/jsonRPC', import.meta.env.VITE_MAINNET_KEY] : ['https://testnet.toncenter.com/api/v2/jsonRPC', import.meta.env.VITE_TESTNET_KEY]

// @ts-ignore
export const tonweb = new TonWeb(new TonWeb.HttpProvider(net, {apiKey}))
export const collections = writable([])
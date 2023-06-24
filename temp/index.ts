import {ethers} from "ethers";

import ExpirableERC721ABI from "./abi/ExpirableERC721.json";
const RPC_URL = "https://polygon-mumbai-bor.publicnode.com";

async function queryAddress(contractAddress:string , address: string) {

  const provider = new ethers.providers.JsonRpcProvider(RPC_URL);

  const contract = new ethers.Contract(contractAddress, ExpirableERC721ABI["abi"], provider);

  console.log(await contract.getOwnedTokenIds(address));
}

async function main() {
  queryAddress("", "");
}

main();

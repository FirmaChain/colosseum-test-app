import { FirmaSDK, FirmaUtil } from "@firmachain/firma-js";
import { FirmaConfig } from "@firmachain/firma-js";
import { FirmaWalletService } from "@firmachain/firma-js/dist/sdk/FirmaWalletService";

import fs from "fs";

const Logger = require('./utils/logger');

var firma = new FirmaSDK(FirmaConfig.TestNetConfig);

let signer1Mnemonic = "";
let signer2Mnemonic = "";
let signer3Mnemonic = "";
let signer4Mnemonic = "";

let contractHash = "";
let globalFileHash = "";

test();

async function test() {

    const fileData = fs.readFileSync("mnemonic.json");
    const readData = JSON.parse(fileData.toString());
    const mnemonic = readData.mnemonic;

    let wallet = await firma.Wallet.fromMnemonic(mnemonic);

    let address = await wallet.getAddress();
    let balance = await firma.Bank.getBalance(address);

    Logger.info("[TEST START: " + new Date() + "]");

    Logger.info("your wallet address : " + address);
    Logger.info("your wallet balance : " + balance);


    for (let i = 0; i < 4; i++) {
        await InitCommon(firma);

        await StartContractTest1(firma, wallet);
        await StartContractTest2(firma, wallet);
        await StartContractTest3(firma, wallet);
        await StartContractTest4(firma, wallet);

        await StartBankTest1(firma, wallet);
        await StartNFTTest1(firma, wallet);
        await StartNFTTest2(firma, wallet);
        await StartNFTTest3(firma, wallet);

        await StartFinalContractTest1(firma, wallet);
        await StartFinalContractTest2(firma, wallet);
        await StartFinalContractTest3(firma, wallet);
        await StartFinalContractTest4(firma, wallet);
        await StartFinalContractTest5(firma, wallet);
        await StartFinalContractTest6(firma, wallet);
        await StartFinalContractTest7(firma, wallet);
        await StartFinalContractTest8(firma, wallet);
        await StartFinalContractTest9(firma, wallet);
        await StartFinalContractTest10(firma, wallet);
    }

    Logger.info("[TEST END: " + new Date() + "]");
}

async function InitCommon(firma: FirmaSDK) {
    let timeStamp = Math.round(+new Date() / 1000);;

    contractHash = "0xtestcontract" + Math.round(+new Date() / 1000);
    globalFileHash = await FirmaUtil.getFileHash("./test/sample/sample_contract.pdf") + timeStamp;

    signer1Mnemonic = (await firma.Wallet.newWallet()).getMnemonic();
    signer2Mnemonic = (await firma.Wallet.newWallet()).getMnemonic();
    signer3Mnemonic = (await firma.Wallet.newWallet()).getMnemonic();
    signer4Mnemonic = (await firma.Wallet.newWallet()).getMnemonic();

}

function printTxLog(result: any) {
    Logger.info("==> [TX start]");
    Logger.info("==> - code: " + result.code);
    Logger.info("==> - height: " + result.height);
    Logger.info("==> - rawLog: " + result.rawLog);
    Logger.info("==> - transactionHash: " + result.transactionHash);
    Logger.info("==> [TX end]");
}

async function StartContractTest1(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartContractTest1");

    let contractHash = "0xsalkdjfasldkjf2";
    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "CreateContract";
    let ownerAddress = await wallet.getAddress();
    let jsonString = "{}";

    var tx = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
    var result = await firma.Contract.signAndBroadcast(wallet, [tx, tx, tx]);

    printTxLog(result);
}

async function StartContractTest2(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartContractTest2");

    let contractHash = "0xsalkdjfasldkjf2";
    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "CreateContract";
    let ownerAddress = await wallet.getAddress();
    let jsonString = "{}";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);

    printTxLog(result);
}

async function StartContractTest3(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartContractTest3");

    let timeStamp = Math.round(+new Date() / 1000);
    let fileHash = "0xklsdjflaksjflaksjf" + timeStamp; // random create

    let ownerAddress = await wallet.getAddress();
    let ownerList = [ownerAddress, ownerAddress];
    let jsonString = "{}";

    var tx1 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash, timeStamp, ownerList, jsonString);
    var tx2 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash + "a", timeStamp, ownerList, jsonString);
    var tx3 = await firma.Contract.getUnsignedTxCreateContractFile(wallet, fileHash + "b", timeStamp, ownerList, jsonString);


    var result = await firma.Contract.signAndBroadcast(wallet, [tx1, tx2, tx3]);

    printTxLog(result);
}

async function StartContractTest4(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartContractTest4");

    let timeStamp = Math.round(+new Date() / 1000);
    let fileHash = "0xklsdjflaksjflaksjf" + timeStamp;

    let ownerAddress = await wallet.getAddress();
    let ownerList = [ownerAddress, ownerAddress];
    let jsonString = "{}";

    var result = await firma.Contract.createContractFile(wallet, fileHash, timeStamp, ownerList, jsonString);
    printTxLog(result);
}


async function StartBankTest1(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartBankTest1");

    const targetWallet = await firma.Wallet.newWallet();
    const amount = 1;

    var result = await firma.Bank.send(wallet, await targetWallet.getAddress(), amount);

    printTxLog(result);
}

async function StartNFTTest1(firma: FirmaSDK, wallet: FirmaWalletService) {
    Logger.info("StartNFTTest1");

    var result = await firma.Nft.mint(wallet, "https://firmachain.org");

    // get nftId below code
    var jsonData = JSON.parse(result.rawLog!);
    var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

    printTxLog(result);
}

async function StartNFTTest2(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartNFTTest2");

    let targetWallet = await firma.Wallet.newWallet();

    var result = await firma.Nft.mint(wallet, "https://firmachain.org");

    var jsonData = JSON.parse(result.rawLog!);
    var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

    var result = await firma.Nft.transfer(wallet, await targetWallet.getAddress(), nftId);
    printTxLog(result);

}

async function StartNFTTest3(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartNFTTest3");

    var result = await firma.Nft.mint(wallet, "https://firmachain.org");

    var jsonData = JSON.parse(result.rawLog!);
    var nftId = jsonData[0]["events"][0]["attributes"][2]["value"];

    var result = await firma.Nft.burn(wallet, nftId);
    printTxLog(result);
}

async function StartFinalContractTest1(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest1");

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "CreateContract";
    let ownerAddress = await wallet.getAddress();
    let jsonString = "{\"totalOwner\":4}";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress, jsonString);
    printTxLog(result);
}

async function StartFinalContractTest2(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest2");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "AddSigner";
    let ownerAddress1 = await signer1Wallet.getAddress();
    let ownerAddress2 = await signer2Wallet.getAddress();
    let ownerAddress3 = await signer3Wallet.getAddress();
    let ownerAddress4 = await signer4Wallet.getAddress();
    let jsonString = "";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress1, jsonString);
    printTxLog(result);

    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress2, jsonString);
    printTxLog(result);

    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress3, jsonString);
    printTxLog(result);

    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress4, jsonString);
    printTxLog(result);

}

async function StartFinalContractTest3(firma: FirmaSDK, wallet: FirmaWalletService) {
    Logger.info("StartFinalContractTest3");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "AddSigner";
    let ownerAddress1 = await signer1Wallet.getAddress();
    let ownerAddress2 = await signer2Wallet.getAddress();
    let ownerAddress3 = await signer3Wallet.getAddress();
    let ownerAddress4 = await signer4Wallet.getAddress();
    let jsonString = "";

    var msg1 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress1, jsonString);
    var msg2 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress2, jsonString);
    var msg3 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress3, jsonString);
    var msg4 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress4, jsonString);

    let result = await firma.Contract.signAndBroadcast(wallet, [msg1, msg2, msg3, msg4]);
    printTxLog(result);
}

async function StartFinalContractTest4(firma: FirmaSDK, wallet: FirmaWalletService) {
    Logger.info("StartFinalContractTest4");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "SignContract";
    let ownerAddress1 = await signer1Wallet.getAddress();
    let ownerAddress2 = await signer2Wallet.getAddress();
    let ownerAddress3 = await signer3Wallet.getAddress();
    let ownerAddress4 = await signer4Wallet.getAddress();
    let jsonString = "";

    var msg1 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress1, jsonString);
    var msg2 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress2, jsonString);
    var msg3 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress3, jsonString);
    var msg4 = await firma.Contract.getUnsignedTxAddContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress4, jsonString);

    let result = await firma.Contract.signAndBroadcast(wallet, [msg1, msg2, msg3, msg4]);
    printTxLog(result);
}

async function StartFinalContractTest5(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest5");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "SignContract";
    let ownerAddress1 = await signer1Wallet.getAddress();
    let ownerAddress2 = await signer2Wallet.getAddress();
    let ownerAddress3 = await signer3Wallet.getAddress();
    let ownerAddress4 = await signer4Wallet.getAddress();
    let jsonString = "";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress1, jsonString);
    printTxLog(result);

    timeStamp = Math.round(+new Date() / 1000);;
    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress2, jsonString);
    printTxLog(result);

    timeStamp = Math.round(+new Date() / 1000);;
    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress3, jsonString);
    printTxLog(result);

    timeStamp = Math.round(+new Date() / 1000);;
    result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress4, jsonString);
    printTxLog(result);
}

async function StartFinalContractTest6(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest6");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "RejectContract";
    let ownerAddress1 = await signer1Wallet.getAddress();
    let jsonString = "";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, ownerAddress1, jsonString);
    printTxLog(result);

}

async function StartFinalContractTest7(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest7");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "DestroyContract";
    let creatorAddress = await wallet.getAddress();
    let ownerAddress1 = await signer1Wallet.getAddress(); // reject user
    let jsonString = "{\"Notes\": \"" + "Reject Contract by " + ownerAddress1 + "\"" + "}";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, creatorAddress, jsonString);
    printTxLog(result);

}

async function StartFinalContractTest8(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest8");

    let timeStamp = Math.round(+new Date() / 1000);;
    let eventName = "CompleteContract";
    let creatorAddress = await wallet.getAddress();

    let fileHash = await FirmaUtil.getFileHash("./test/sample/sample_contract.pdf");
    let jsonString = "{\"fileHash\": \"" + fileHash + "\"" + "}";

    var result = await firma.Contract.addContractLog(wallet, contractHash, timeStamp, eventName, creatorAddress, jsonString);
    printTxLog(result);

}

async function StartFinalContractTest9(firma: FirmaSDK, wallet: FirmaWalletService) {

    Logger.info("StartFinalContractTest9");

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let ipfsFileHash = "Qmf412jQZiuVUtdgnB36FXFX7xg5V6KEbSJ4dpQuhkLyfD";

    let encryptHash = signer1Wallet.encryptData(ipfsFileHash);
    let decryptHash = signer1Wallet.decryptData(encryptHash);
    Logger.info(ipfsFileHash);
    Logger.info(decryptHash);

    encryptHash = signer2Wallet.encryptData(ipfsFileHash);
    decryptHash = signer2Wallet.decryptData(encryptHash);
    Logger.info(ipfsFileHash);
    Logger.info(decryptHash);

    encryptHash = signer3Wallet.encryptData(ipfsFileHash);
    decryptHash = signer3Wallet.decryptData(encryptHash);
    Logger.info(ipfsFileHash);
    Logger.info(decryptHash);

    encryptHash = signer4Wallet.encryptData(ipfsFileHash);
    decryptHash = signer4Wallet.decryptData(encryptHash);
    Logger.info(ipfsFileHash);
    Logger.info(decryptHash);

}

async function StartFinalContractTest10(firma: FirmaSDK, wallet: FirmaWalletService) {

    printTxLog("StartFinalContractTest10")

    const signer1Wallet = await firma.Wallet.fromMnemonic(signer1Mnemonic);
    const signer2Wallet = await firma.Wallet.fromMnemonic(signer2Mnemonic);
    const signer3Wallet = await firma.Wallet.fromMnemonic(signer3Mnemonic);
    const signer4Wallet = await firma.Wallet.fromMnemonic(signer4Mnemonic);

    let ownerAddress1 = await signer1Wallet.getAddress();
    let ownerAddress2 = await signer2Wallet.getAddress();
    let ownerAddress3 = await signer3Wallet.getAddress();
    let ownerAddress4 = await signer4Wallet.getAddress();

    let timeStamp = Math.round(+new Date() / 1000);;
    let fileHash = globalFileHash;

    //console.log("fileHash : " + fileHash);

    let ipfsHash = await firma.Ipfs.addJson(globalFileHash);

    let encryptHash1 = signer1Wallet.encryptData(ipfsHash);
    let encryptHash2 = signer2Wallet.encryptData(ipfsHash);
    let encryptHash3 = signer3Wallet.encryptData(ipfsHash);
    let encryptHash4 = signer4Wallet.encryptData(ipfsHash);

    var jsonData = {
        "storage": "ipfs",
        "encryptIpfsHash": [encryptHash1, encryptHash2, encryptHash3, encryptHash4]
    }

    let jsonString = JSON.stringify(jsonData);

    var result = await firma.Contract.createContractFile(wallet, fileHash, timeStamp, [ownerAddress1, ownerAddress2, ownerAddress3, ownerAddress4], jsonString);
    printTxLog(result);

    var contractFile = await firma.Contract.getContractFile(fileHash);
    Logger.info(result);

    let metaData = JSON.parse(contractFile.metaDataJsonString);

    let decryptHash1 = signer1Wallet.decryptData(metaData.encryptIpfsHash[0]);
    Logger.info(decryptHash1);
    let decryptHash2 = signer2Wallet.decryptData(metaData.encryptIpfsHash[1]);
    Logger.info(decryptHash2);
    let decryptHash3 = signer3Wallet.decryptData(metaData.encryptIpfsHash[2]);
    Logger.info(decryptHash3);
    let decryptHash4 = signer4Wallet.decryptData(metaData.encryptIpfsHash[3]);
    Logger.info(decryptHash4);

    Logger.info("contract file url:" + firma.Ipfs.getURLFromHash(decryptHash1));
}

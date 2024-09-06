const anchor = require("@project-serum/anchor");
const { SystemProgram } = anchor.web3;

//const privateKey = Uint8Array.from([206,65,145,162,160,137,130,127,73,214,0,140,128,199,66,4,18,147,132,244,162,188,29,136,53,111,35,61,72,205,109,196,168,178,40,91,43,84,10,53,161,217,146,225,235,130,26,19,69,104,180,146,78,122,213,70,178,148,38,48,216,95,243,64]);

const TestFunc = async () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const program = anchor.workspace.StorageProject;

    // Corrected line below
    
    const account = anchor.web3.Keypair.fromSecretKey(privateKey);

   //const account = anchor.web3.Keypair.generate();

   console.log("public key :-", account.publicKey.toString());

    let tx = await program.rpc.initialize({
        accounts: {
            initialAccount: account.publicKey,
            user: provider.wallet.publicKey,
            systemProgram: SystemProgram.programId,
        },
        signers: [account],
    });

    console.log('Transaction Signature', tx);

    let fetchedValue = await program.account.init.fetch(account.publicKey);
    console.log('Output value:', fetchedValue.value.toString());

    const value = new anchor.BN(50);

    console.log("Valueee :-", value);
    let tx2 = await program.rpc.updateValue(value,{

      accounts:{
        storageAccount:account.publicKey,
      },
    })
    console.log("Update Transacton :- ",tx2);
    
    let fetchedValue2 = await program.account.init.fetch(account.publicKey);
    console.log('Update value:', fetchedValue2.value.toString());



};

const runTest = async () => {
  try {
    await TestFunc();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runTest();

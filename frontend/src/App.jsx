import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import idl from "./storage_project.json";

import { Buffer } from "buffer";

window.Buffer = Buffer;

const { SystemProgram, Keypair } = anchor.web3;

const privateKey = Uint8Array.from([
  206, 65, 145, 162, 160, 137, 130, 127, 73, 214, 0, 140, 128, 199, 66, 4, 18,
  147, 132, 244, 162, 188, 29, 136, 53, 111, 35, 61, 72, 205, 109, 196, 168,
  178, 40, 91, 43, 84, 10, 53, 161, 217, 146, 225, 235, 130, 26, 19, 69, 104,
  180, 146, 78, 122, 213, 70, 178, 148, 38, 48, 216, 95, 243, 64,
]);

let myaccount = Keypair.fromSecretKey(privateKey);

//let myaccount = Keypair.generate();
const programID = new PublicKey(idl.metadata.address);
console.log(programID, "Program Id set correctly");

console.log("program ID ; - ", programID.toBase58());

const network = clusterApiUrl("devnet");

const opts = {
  preflightCommitment: "processed",
};

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [retrieveValue, setRetrieveValue] = useState(null);
  const [inputValue, setInputValue] = useState("");

  window.onload = async function () {
    try {
      if (window.solana) {
        const solana = window.solana;
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const res = await solana.connect({ onlyIfTrusted: true });
          console.log("Connected with public Key :", res.publicKey.toString());
          setWalletAddress(res.publicKey.toString());
          await retrieveValue();
          if (retrieveValue === null) {
            await createAccount();
          }
        }
      } else {
        alert("Wallet not found! Get a phantom wallet");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const connectwallet = async () => {
    if (window.solana) {
      const solana = window.solana;
      const res = await solana.connect();
      setWalletAddress(res.publicKey.toString());
    } else {
      alert("wallet not found ! get a Phantom wallet");
    }
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new anchor.AnchorProvider(
      connection, // Corrected connection instance
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const Retrieve = async () => {
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl, programID, provider);

      // Ensure you're using the correct keypair and public key
      console.log("Public Key:", myaccount.publicKey.toString());
      const account = await program.account.init.fetch(myaccount.publicKey);

      // console.log("ACCOUNT DATA IS :-", account);

      setRetrieveValue(account.value.toString());
    } catch (err) {
      setRetrieveValue(null);
      console.error("Error in Fetching:", err);
      // setRetrieveValue(null);
    }
  };
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const createAccount = async () => {
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl, programID, provider);
      let tx = await program.rpc.initialize({
        accounts: {
          initialAccount: myaccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [myaccount],
      });

      console.log(
        " create account and address : -",
        myaccount.publicKey.toString()
      );
    } catch (error) {
      console.log("Error in creating account :", error);
    }
  };

  const UpdateValue = async () => {
    try {
      const provider = getProvider();
      const program = new anchor.Program(idl, programID, provider);
      const value = new anchor.BN(inputValue);

      console.log("Valueee :-", value);

      let tx2 = await program.rpc.updateValue(value, {
        accounts: {
          storageAccount: myaccount.publicKey,
        },
      });
      setInputValue("");
    } catch (err) {
      console.log("Error in update function :", err);
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <h2 className="header">SOLANA STORAGE APP</h2>

          <div>
            {!walletAddress && (
              <div>
                <button className="btn" onClick={connectwallet}>
                  Connect Wallet
                </button>
              </div>
            )}

            {walletAddress && (
              <div>
                <p>
                  Connected account :{" "}
                  <span className="address"> {walletAddress}</span>
                </p>
                <div className="grid-container">
                  {/* set value column one */}
                  <div className="grid-item">
                      <input
                        className="inp"
                        placeholder="value"
                        value={inputValue}
                        onChange={onInputChange}
                      ></input>
                    <br></br>
                    <button className="btn2" onClick={UpdateValue}>
                      Store
                    </button>
                  </div>
                  {/*get value column two */}
                  <div className="grid-item">
                    <input
                      className="inp"
                      placeholder="retrieve_value"
                      value={retrieveValue}
                    ></input>
                    <button className="btn2" onClick={Retrieve}>
                      Retrieve
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </header>
      </div>
    </>
  );
}

export default App;

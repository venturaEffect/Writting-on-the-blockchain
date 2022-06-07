import React, { Component } from "react";
import WrittingOnTheBlockchainContract from "./contracts/WrittingOnTheBlockchain.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = { 
    valorActual:"",
    newValue: "",
    web3: null,
    accounts: null, 
    contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = WrittingOnTheBlockchainContract.networks[networkId];
      const instance = new web3.eth.Contract(
        WrittingOnTheBlockchainContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance });

      const response = await this.state.contract.methods.Read().call();
      this.setState({
        valorActual : response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  storeValue = async (event) => {
    event.preventDefault();

    const { accounts, contract } = this.state;

    try{
      // Stores a newValue in Blockchain.
      await contract.methods.Write(this.state.newValue).send({ from: accounts[0] });

      const response = await this.state.contract.methods.Read().call();

      this.setState({
        valorActual : response
      })
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        error
      );
      console.error(error);
    }
  };

  handleChangeValue = (event) => {
    this.setState({
      newValue : event.target.value
    })
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Writting on blockchain</h1>
        <label>Actual value on the blockchain is: {this.state.valorActual}</label>
        <br/>
        <form onSubmit={this.storeValue}>
        <label>The new value to store inside the blockchain is: </label>
        <br/>
        <input type="text" value={this.state.newValue} onChange={this.handleChangeValue}></input>
        <br/>
        <input type="submit" value="STORE"></input>
        </form>
      </div>
    );
  }
}

export default App;

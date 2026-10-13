import Web3 from "web3";
import { setGlobalState, getGlobalState } from "./store";
import abi from "./abis/DominionDAO.json";

const { ethereum } = window;
if (ethereum) {
  window.web3 = new Web3(ethereum);
} else {
  window.web3 = new Web3(new Web3.providers.HttpProvider("https://rpc.sepolia.org"));
}

const connectWallet = async () => {
  try {
    if (!ethereum) return alert("Please install Metamask");
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    setGlobalState("connectedAccount", accounts[0].toLowerCase());
  } catch (error) {
    reportError(error);
  } finally {
    window.location.reload();
  }
};

const isWallectConnected = async () => {
  try {
    if (!ethereum) return;
    const accounts = await ethereum.request({ method: "eth_accounts" });
    window.ethereum.on("chainChanged", (chainId) => {
      window.location.reload();
    });
    window.ethereum.on("accountsChanged", async (accs) => {
      if (accs.length) {
        setGlobalState("connectedAccount", accs[0].toLowerCase());
        window.location.reload();
      } else {
        setGlobalState("connectedAccount", "");
      }
    });

    if (accounts.length) {
      setGlobalState("connectedAccount", accounts[0].toLowerCase());
    } else {
      console.log("No accounts found. Please connect wallet.");
    }
  } catch (error) {
    reportError(error);
  }
};

const getEtheriumContract = async () => {
  const connectedAccount = getGlobalState("connectedAccount");
  const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
  const web3 = window.web3;
  if (!contractAddress || contractAddress.startsWith("0x0000000000000000000000000000000000000000")) {
    console.warn("Chưa cấu hình địa chỉ REACT_APP_CONTRACT_ADDRESS hợp lệ trong .env");
  }
  if (connectedAccount && web3) {
    const contract = new web3.eth.Contract(abi.abi, contractAddress);
    return contract;
  } else {
    return getGlobalState("contract");
  }
};

const performContribute = async (amount) => {
  try {
    amount = window.web3.utils.toWei(amount.toString(), "ether");
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");
    await contract.methods.contribute().send({ from: account, value: amount });
    window.location.reload();
  } catch (error) {
    reportError(error);
    return error;
  }
};

const getInfo = async () => {
  try {
    if (!ethereum) return;
    const contract = await getEtheriumContract();
    const connectedAccount = getGlobalState("connectedAccount");
    if (!contract || !connectedAccount) return;

    const isStakeholder = await contract.methods
      .isStakeholder()
      .call({ from: connectedAccount });
    const balance = await contract.methods.daoBalance().call();
    const mybalance = await contract.methods
      .getBalance()
      .call({ from: connectedAccount });

    setGlobalState("balance", window.web3.utils.fromWei(balance));
    setGlobalState("mybalance", window.web3.utils.fromWei(mybalance));
    setGlobalState("isStakeholder", isStakeholder);
  } catch (error) {
    reportError(error);
  }
};

const raiseProposal = async ({ title, description, beneficiary, amount }) => {
  try {
    const web3 = window.web3;
    if (!web3.utils.isAddress(beneficiary)) {
      alert("�?a ch? v� ngu?i th? hu?ng (Beneficiary) kh�ng h?p l?!");
      return;
    }
    const cleanBeneficiary = web3.utils.toChecksumAddress(beneficiary.trim());
    const weiAmount = web3.utils.toWei(amount.toString(), "ether");
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");

    await contract.methods
      .createProposal(title, description, cleanBeneficiary, weiAmount)
      .send({ from: account });
    window.location.reload();
  } catch (error) {
    reportError(error);
    alert(error?.message || "T?o proposal th?t b?i, vui l�ng ki?m tra MetaMask!");
    return error;
  }
};

const structuredProposals = (proposals) => {
  return proposals
    .map((proposal) => ({
      id: proposal.id,
      amount: window.web3.utils.fromWei(proposal.amount),
      title: proposal.title,
      description: proposal.description,
      paid: proposal.paid,
      passed: proposal.passed,
      proposer: proposal.proposer,
      upvotes: Number(proposal.upvotes),
      downvotes: Number(proposal.downvotes),
      beneficiary: proposal.beneficiary,
      executor: proposal.executor,
      duration: proposal.duration,
    }))
    .reverse();
};

const getProposals = async () => {
  try {
    if (!ethereum) return;
    const contract = await getEtheriumContract();
    if (!contract) return;
    const proposals = await contract.methods.getProposals().call();
    setGlobalState("proposals", structuredProposals(proposals));
  } catch (error) {
    reportError(error);
  }
};

const getProposal = async (id) => {
  try {
    const proposals = getGlobalState("proposals");
    if (proposals && proposals.length > 0) {
      return proposals.find((proposal) => proposal.id == id);
    }
    const contract = await getEtheriumContract();
    if (contract) {
      const p = await contract.methods.getProposal(id).call();
      return {
        id: p.id,
        amount: window.web3.utils.fromWei(p.amount),
        title: p.title,
        description: p.description,
        paid: p.paid,
        passed: p.passed,
        proposer: p.proposer,
        upvotes: Number(p.upvotes),
        downvotes: Number(p.downvotes),
        beneficiary: p.beneficiary,
        executor: p.executor,
        duration: p.duration,
      };
    }
  } catch (error) {
    reportError(error);
  }
};

const voteOnProposal = async (proposalId, supported) => {
  try {
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");
    await contract.methods
      .performVote(proposalId, supported)
      .send({ from: account });
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const listVoters = async (id) => {
  try {
    const contract = await getEtheriumContract();
    if (!contract) return [];
    const votes = await contract.methods.getVotesOf(id).call();
    return votes;
  } catch (error) {
    reportError(error);
    return [];
  }
};

const payoutBeneficiary = async (id) => {
  try {
    const contract = await getEtheriumContract();
    const account = getGlobalState("connectedAccount");
    await contract.methods.payBeneficiary(id).send({ from: account });
    window.location.reload();
  } catch (error) {
    reportError(error);
  }
};

const reportError = (error) => {
  console.log(JSON.stringify(error), "red");
};

export {
  isWallectConnected,
  connectWallet,
  performContribute,
  getInfo,
  raiseProposal,
  getProposals,
  getProposal,
  voteOnProposal,
  listVoters,
  payoutBeneficiary,
};


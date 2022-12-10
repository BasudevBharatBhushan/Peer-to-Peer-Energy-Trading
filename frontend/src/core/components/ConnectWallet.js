export const ConnectWallet = async () => {
  if (window.ethereum) {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    return accounts;
  }
  return null;
};

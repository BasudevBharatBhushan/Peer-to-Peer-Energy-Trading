const { ethers } = require("hardhat")
const IRelayHub = require("../artifacts/@opengsn/contracts/src/interfaces/IRelayHub.sol/IRelayHub.json")

async function main() {
    console.log("---------------------------------------------------")
    const whitelistPaymaster = await ethers.getContract("WhitelistPaymaster")

    // Set Forwarder
    const setForwarder = await whitelistPaymaster.setTrustedForwarder(
        process.env.FORWARDER_CONTRACT_ADDRESS
    )
    await setForwarder.wait(1)

    console.log(setForwarder)

    //Set Whitelist Configuration
    const setConfiguration = await whitelistPaymaster.setConfiguration(true, false, false, false)
    await setConfiguration.wait(1)

    console.log(setConfiguration)

    //Set Whitelist Sender
    const setWhitelistSender = await whitelistPaymaster.whitelistSender(
        "0x788A679C5Bc41666783B97d8b007a29885a80ba9",
        true
    )
    await setWhitelistSender.wait(1)
    console.log(setWhitelistSender)

    //Set Relay Hub
    const setRelayHub = await whitelistPaymaster.setRelayHub(process.env.RELAY_HUB_CONTRACT_ADDRESS)

    await setRelayHub.wait(1)

    console.log(setRelayHub)

    //Fund Relay Hub

    /*
        Fund the relay hub by visiting to this link
        Link - https://mumbai.polygonscan.com/address/0x3232f21A6E08312654270c78A773f00dd61d60f5#writeContract#F2
    */
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })

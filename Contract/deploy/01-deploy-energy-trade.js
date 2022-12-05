const { network } = require("hardhat")
const { verify } = require("../utils/verify")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const developmentChains = ["hardhat", "localhost"]
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    log("--------------------------------------------------------------------")

    const owners = [
        "0x85b3dB26424a88e7C1319E40a6324d64Acf1fFA2",
        "0xaA644EfCDFC1Adaf3CAb69Ae683638f4705F4C81",
        "0xB6E7F3234C709B6C96a60D14A85d41FADDd22FDA",
    ]
    const minOwnerReq_auth = 2

    const arguments = [owners, minOwnerReq_auth]
    const EnergyTrade = await deploy("EnergyTrade", {
        from: deployer,
        args: [owners, minOwnerReq_auth],
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    //Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(EnergyTrade.address, { owners, minOwnerReq_auth })
    }
}

module.exports.tags = ["all", "main"]

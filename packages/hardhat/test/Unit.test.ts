import { expect } from "chai";
import { deployments, ethers } from "hardhat";
import { Tickets, EurocupLegends, UPMock } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Tickets", () => {
    let owner: HardhatEthersSigner
    let creator1: HardhatEthersSigner
    let creator2: HardhatEthersSigner
    let creator3: HardhatEthersSigner
    let user: string
    let creators: any

    let tickets: Tickets
    let eurocupLegends: EurocupLegends

    const TICKET_PRICE = 15

    beforeEach(async () => {
        const signers: any[] = await ethers.getSigners()

        owner = signers[0]
        creator1 = signers[1]
        creator2 = signers[2]
        creator3 = signers[3]

        // deploy mock universal profile
        const upMock = await ethers.getContractFactory("UPMock")
        user = await (await upMock.deploy()).getAddress()

        creators = [{creator: creator1.address, share: 60}, {creator: creator2.address, share: 20}, {creator: creator3.address, share: 20}]

        const eurocupLegendsFactory = await ethers.getContractFactory("EurocupLegends")

        eurocupLegends = (await eurocupLegendsFactory.deploy(creators, owner))
        
        const ticketsFactory = await ethers.getContractFactory("Tickets")
        tickets = (await ticketsFactory.deploy(
            "England Tickets", 
            "ENG", 
            owner,
            await eurocupLegends.getAddress(), 
            ethers.parseEther(TICKET_PRICE.toString()))
        )
    })

    describe("mint()", () => {
        it("mints 3 tickets to the recipient and 5 max", async () => {
            // mint 3
            await tickets.mint(user, 3, {value: ethers.parseEther((TICKET_PRICE * 3).toString())})

            expect(await tickets.balanceOf(user)).to.eq(3)

            // mint 2 more
            await tickets.mint(user, 2, {value: ethers.parseEther((TICKET_PRICE * 2).toString())})
            expect(await tickets.balanceOf(user)).to.eq(5)

            // try to mint 1 more
            await expect(tickets.mint(user, 1, {value: ethers.parseEther(TICKET_PRICE.toString())})).to.be.revertedWithCustomError(tickets, "MintLimitExceeded")
        })
        it("sends cost to the prize pool and splits fee among creators", async () => {
            const ticketsCost = TICKET_PRICE * 3
            const prize = 0.75 * ticketsCost
            const fee = 0.25 * ticketsCost

            let creator1PrevBal = await ethers.provider.getBalance(creator1.address)
            let creator2PrevBal = await ethers.provider.getBalance(creator2.address)
            let creator3PrevBal = await ethers.provider.getBalance(creator3.address)
            let creatorsPrevBals = [creator1PrevBal, creator2PrevBal, creator3PrevBal]

            await tickets.mint(user, 3, {value: ethers.parseEther((ticketsCost).toString())})

            // prize pool keeps 75%
            const prizePoolBalance = await ethers.provider.getBalance(eurocupLegends)
            expect(prizePoolBalance.toString()).to.eq(ethers.parseEther((prize).toString()))

            // creators split 25%
            for(let i = 0; i < creators.length; i++) {
                const share = (fee * creators[i].share) / 100
                const creatorPrevBal = creatorsPrevBals[i]
                const creatorCurrentBal = await ethers.provider.getBalance(creators[i].creator)
                expect(creatorCurrentBal).to.eq(creatorPrevBal + ethers.parseEther(share.toString()))
            }
        })
    })
})
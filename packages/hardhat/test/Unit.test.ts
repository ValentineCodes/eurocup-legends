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

        const creators = [{creator: creator1, share: 60}, {creator: creator2, share: 20}, {creator: creator3, share: 20}]

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

    describe("mint", () => {
        it("mints 3 tickets to the recipient", async () => {
            await tickets.mint(user, 3, {value: ethers.parseEther((TICKET_PRICE * 3).toString())})

            const ticketsBalance = await tickets.balanceOf(user)
            expect(ticketsBalance).to.eq(3)
        })
    })
})
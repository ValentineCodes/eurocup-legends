import { expect } from "chai";
import { ethers } from "hardhat";
import { Shirts, SportsLegends, UPMock } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("Test", () => {
    let owner: HardhatEthersSigner
    let creator1: HardhatEthersSigner
    let creator2: HardhatEthersSigner
    let creator3: HardhatEthersSigner

    let valentine: UPMock
    let tanto: UPMock
    let wafel: UPMock
    let valentineAddress: string
    let tantoAddress: string
    let wafelAddress: string

    let creators: any

    let engShirts: Shirts
    let frShirts: Shirts
    let grShirts: Shirts
    let sportsLegends: SportsLegends

    const ENG_SHIRT_PRICE = 15
    const FR_SHIRT_PRICE = 14
    const GR_SHIRT_PRICE = 13

    function numberToBytes32(number: number): string {
        return ethers.AbiCoder.defaultAbiCoder().encode(["uint256"], [number])
    }

    beforeEach(async () => {
        const signers: any[] = await ethers.getSigners()

        owner = signers[0]
        creator1 = signers[1]
        creator2 = signers[2]
        creator3 = signers[3]

        // deploy mock universal profile
        const upMock = await ethers.getContractFactory("UPMock")
        valentine = await upMock.deploy()
        tanto = await upMock.deploy()
        wafel = await upMock.deploy()

        valentineAddress = await valentine.getAddress()
        tantoAddress = await tanto.getAddress()
        wafelAddress = await wafel.getAddress()

        creators = [{creator: creator1.address, share: 60}, {creator: creator2.address, share: 20}, {creator: creator3.address, share: 20}]

        const sportsLegendsFactory = await ethers.getContractFactory("SportsLegends")

        sportsLegends = (await sportsLegendsFactory.deploy(creators, owner))
        
        const shirtsFactory = await ethers.getContractFactory("Shirts")
        engShirts = (await shirtsFactory.deploy(
            "England Shirts", 
            "ENG", 
            owner,
            await sportsLegends.getAddress(), 
            ethers.parseEther("15"))
        )
        frShirts = (await shirtsFactory.deploy(
            "France Shirts", 
            "FR", 
            owner,
            await sportsLegends.getAddress(), 
            ethers.parseEther("14"))
        )
        grShirts = (await shirtsFactory.deploy(
            "Germany Shirts", 
            "GR", 
            owner,
            await sportsLegends.getAddress(), 
            ethers.parseEther("13"))
        )
    })

    describe("Shirts.mint()", () => {
        it("mints 3 England shirts to the recipient and 5 max", async () => {
            // mint 3
            await engShirts.mint(valentineAddress, 3, {value: ethers.parseEther((ENG_SHIRT_PRICE * 3).toString())})

            expect(await engShirts.balanceOf(valentineAddress)).to.eq(3)

            // mint 2 more
            await engShirts.mint(valentineAddress, 2, {value: ethers.parseEther((ENG_SHIRT_PRICE * 2).toString())})
            expect(await engShirts.balanceOf(valentineAddress)).to.eq(5)

            // try to mint 1 more
            await expect(engShirts.mint(valentineAddress, 1, {value: ethers.parseEther(ENG_SHIRT_PRICE.toString())})).to.be.revertedWithCustomError(engShirts, "MintLimitExceeded")
        })
        it("sends cost to the prize pool and splits fee among creators", async () => {
            const engShirtsCost = ENG_SHIRT_PRICE * 3
            const prize = 0.75 * engShirtsCost
            const fee = 0.25 * engShirtsCost

            let creator1PrevBal = await ethers.provider.getBalance(creator1.address)
            let creator2PrevBal = await ethers.provider.getBalance(creator2.address)
            let creator3PrevBal = await ethers.provider.getBalance(creator3.address)
            let creatorsPrevBals = [creator1PrevBal, creator2PrevBal, creator3PrevBal]

            await engShirts.mint(valentineAddress, 3, {value: ethers.parseEther((engShirtsCost).toString())})

            // prize pool keeps 75%
            const prizePoolBalance = await ethers.provider.getBalance(sportsLegends)
            expect(prizePoolBalance.toString()).to.eq(ethers.parseEther((prize).toString()))

            // creators split 25%
            for(let i = 0; i < creators.length; i++) {
                const share = (fee * creators[i].share) / 100
                const creatorPrevBal = creatorsPrevBals[i]
                const creatorCurrentBal = await ethers.provider.getBalance(creators[i].creator)
                expect(creatorCurrentBal).to.eq(creatorPrevBal + ethers.parseEther(share.toString()))
            }
        })
        it("reverts if mint is closed", async () => {
            await sportsLegends.setMintStatus(false)

            await expect(engShirts.mint(valentineAddress, 1, {value: ethers.parseEther((ENG_SHIRT_PRICE).toString())})).to.be.revertedWithCustomError(sportsLegends, "TransferFailed")
        })
    })

    describe("SportsLegends.setWinners()", () => {
        async function mintShirts() {
            await engShirts.mint(valentineAddress, 3, {value: ethers.parseEther((ENG_SHIRT_PRICE * 3).toString())})
            await frShirts.mint(valentineAddress, 3, {value: ethers.parseEther((FR_SHIRT_PRICE * 3).toString())})
            await grShirts.mint(valentineAddress, 3, {value: ethers.parseEther((GR_SHIRT_PRICE * 3).toString())})
        }

        async function setWinners() {
            await mintShirts()

            const engAddress = await engShirts.getAddress()
            const frAddress = await frShirts.getAddress()
            const grAddress = await grShirts.getAddress()

            const winners = [engAddress, frAddress, grAddress]
            const shares = [60, 30, 10]
            // @ts-ignore
            await sportsLegends.setWinners(winners, shares)
        }

        it("closes mint", async () => {
            await setWinners()

            expect(await sportsLegends.isMintOpen()).to.be.false
        })
        it("stores prize of each country", async () => {
            await setWinners()

            const engPrize = await sportsLegends.getCountryPrize(await engShirts.getAddress())
            const frPrize = await sportsLegends.getCountryPrize(await frShirts.getAddress())
            const grPrize = await sportsLegends.getCountryPrize(await grShirts.getAddress())

            expect(engPrize + frPrize + grPrize).to.eq(await ethers.provider.getBalance(sportsLegends))
        })
    })

    describe("SportsLegends.claimPrize()", () => {
        async function mintShirts() {
            await engShirts.mint(valentineAddress, 3, {value: ethers.parseEther((ENG_SHIRT_PRICE * 3).toString())})
            await frShirts.mint(valentineAddress, 3, {value: ethers.parseEther((FR_SHIRT_PRICE * 3).toString())})
            await grShirts.mint(valentineAddress, 3, {value: ethers.parseEther((GR_SHIRT_PRICE * 3).toString())})
        }

        async function setWinners() {
            await mintShirts()

            const engAddress = await engShirts.getAddress()
            const frAddress = await frShirts.getAddress()
            const grAddress = await grShirts.getAddress()

            const winners = [engAddress, frAddress, grAddress]
            const shares = [60, 30, 10]
            // @ts-ignore
            await sportsLegends.setWinners(winners, shares)
        }

        it("sends prize to valentine", async () => {
            await setWinners()

            const country = await engShirts.getAddress()
            const prize = await sportsLegends.getPrize(valentineAddress, country)

            const prevUserBal = await ethers.provider.getBalance(valentineAddress)
            await sportsLegends.claimPrize(valentineAddress, country)

            expect(await ethers.provider.getBalance(valentineAddress)).to.eq(prevUserBal + prize)
        })

        it("only claim prize of unclaimed tokens", async () => {
            await engShirts.mint(valentineAddress, 1, {value: ethers.parseEther((ENG_SHIRT_PRICE).toString())})
            await engShirts.mint(tantoAddress, 1, {value: ethers.parseEther((ENG_SHIRT_PRICE).toString())})

            // set winners
            const engAddress = await engShirts.getAddress()
            const frAddress = await frShirts.getAddress()
            const grAddress = await grShirts.getAddress()

            const winners = [engAddress, frAddress, grAddress]
            const shares = [60, 30, 10]
            // @ts-ignore
            await sportsLegends.setWinners(winners, shares)

            const engShirtsAddress = await engShirts.getAddress()

            await sportsLegends.claimPrize(valentineAddress, engShirtsAddress)

            const tokenId = numberToBytes32(1)
            await valentine.connect(owner).transfer(await engShirts.getAddress(), valentineAddress, tantoAddress, tokenId, false, tokenId)

            const tantoPrize = await sportsLegends.getPrize(tantoAddress, engShirtsAddress)
            const tantoBal = await ethers.provider.getBalance(tantoAddress)
            await sportsLegends.claimPrize(tantoAddress, engShirtsAddress)

            expect(await sportsLegends.getCountryPrize(engShirtsAddress)).to.eq(0)

            expect(await ethers.provider.getBalance(tantoAddress)).to.eq(tantoBal + tantoPrize)
        })

        it("reverts if tokens have been claimed", async () => {
            await engShirts.mint(valentineAddress, 1, {value: ethers.parseEther((ENG_SHIRT_PRICE).toString())})
            await engShirts.mint(tantoAddress, 1, {value: ethers.parseEther((ENG_SHIRT_PRICE).toString())})

            // set winners
            const engAddress = await engShirts.getAddress()
            const frAddress = await frShirts.getAddress()
            const grAddress = await grShirts.getAddress()

            const winners = [engAddress, frAddress, grAddress]
            const shares = [60, 30, 10]
            // @ts-ignore
            await sportsLegends.setWinners(winners, shares)

            const engShirtsAddress = await engShirts.getAddress()

            await sportsLegends.claimPrize(valentineAddress, engShirtsAddress)

            await valentine.connect(owner).transfer(await engShirts.getAddress(), valentineAddress, wafelAddress, numberToBytes32(1), false, numberToBytes32(1))

            await expect(sportsLegends.claimPrize(wafelAddress, engShirtsAddress)).to.be.revertedWithCustomError(sportsLegends, "AlreadyClaimedPrize")
        })
    })
})
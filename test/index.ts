import "@nomiclabs/hardhat-ethers";
import { expect } from "chai";
import { ethers as hre } from "hardhat";
import { BigNumber } from "ethers";

let AccountA: any;
let AccountB: any;
let AccountC: any;

const ZeroAddress = "0x0000000000000000000000000000000000000000";

describe("ERC20", function() {

  async function createERC20() {
    const ERC20 = await hre.getContractFactory("ERC20");
    const erc20 = await ERC20.deploy("Cody", "CD", BigNumber.from((10 ** 18).toString()));
    await erc20.deployed();
    [AccountA, AccountB, AccountC] = await hre.getSigners();
    return erc20
  }

  let erc20: any;
  before(async function() {
    erc20 = await createERC20();
  });

  it("Should return the erc20 name is Cody", async function() {
    expect(await erc20.name()).to.equal("Cody");
  });

  it("Should return the erc20 symbol is CD", async function() {
    expect(await erc20.symbol()).to.equal("CD");
  });

  it("Should return the erc20 total supply is 0 before mint", async function() {
    expect(await erc20.totalSupply()).to.equal(0);
  });

  it("mint 1000, should return 1000", async function() {
    await erc20.mint(AccountA.address, BigNumber.from("1000"));
    expect(await erc20.balanceOf(AccountA.address)).to.equal(BigNumber.from("1000"));
  });

  it("Transfer amount to an account", async function() {
    await erc20.transfer(AccountB.address, BigNumber.from("10"));
    expect(await erc20.balanceOf(AccountA.address)).to.equal(BigNumber.from("990"));
    expect(await erc20.balanceOf(AccountB.address)).to.equal(BigNumber.from("10"));
  });

  it("approve amount to an account 10, check allowance should be 10", async function() {
    await erc20.approve(AccountB.address, BigNumber.from("10"));
    expect(await erc20.allowance(AccountA.address, AccountB.address)).to.equal(BigNumber.from("10"));
  });

  it("Transfer 10 from an account to an other account, check balance should be 10", async function() {
    await erc20.connect(AccountB).transferFrom(AccountA.address, AccountC.address, BigNumber.from("9"));
    expect(await erc20.allowance(AccountA.address, AccountB.address)).to.equal(BigNumber.from("1"));
    expect(await erc20.balanceOf(AccountA.address)).to.equal(BigNumber.from("981"));
    expect(await erc20.balanceOf(AccountB.address)).to.equal(BigNumber.from("10"));
    expect(await erc20.balanceOf(AccountC.address)).to.equal(BigNumber.from("9"));
  });

  it("Transfer 10 again, should failed", async function() {
    try {
      await erc20.connect(AccountB).transferFrom(AccountA.address, AccountC.address, BigNumber.from("10"));
    } catch (err) {
      expect((err as Error).message.includes("ERC20: insufficient allowance")).to.equal(true);
    }
  });

  it("AcountB Mint, Should be failed", async function() {
    try {
      await erc20.connect(AccountB).mint(AccountB.address, BigNumber.from("1000"));
    } catch (err) {
      expect((err as Error).message.includes("Ownable: caller is not the owner")).to.equal(true);
    }
  });

  it("Mint token for address 0, Should be failed", async function() {
    try {
      await erc20.mint(ZeroAddress, BigNumber.from("100"));
    } catch (err) {
      expect((err as Error).message.includes("ERC20: zero address")).to.equal(true);
    }
  });

  it("Mint token bigger than the max supply, Should be failed", async function() {
    try {
      await erc20.mint(AccountB.address, BigNumber.from((10 ** 18 - 1000 + 1).toString()));
    } catch (err) {
      expect((err as Error).message.includes("ERC20: exceeds the max supply")).to.equal(true);
    }
  });

});

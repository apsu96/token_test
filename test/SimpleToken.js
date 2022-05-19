const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = ethers.utils;

const MINTED_AMOUNT = parseEther("100");
const TRANSFERRED_AMOUNT = parseEther("50");
const ALLOWANCE_AMOUNT = parseEther("25");

describe("Token contract", function() {
  before(async function() {
    const accounts = await ethers.getSigners();
    this.deployer = accounts[0];
    this.counterparty = accounts[1];
    this.stranger = accounts[2];
    this.representative = accounts[3];
    this.minter = accounts[4];
    this.tokenFactory = await ethers.getContractFactory("SimpleToken");
  });

  beforeEach(async function() {
    this.token = await this.tokenFactory.deploy(this.minter.address);
  });

  it("successfully deployed!", async function() {
    this.token.deployed();
  });

  it("has a name", async function() {
    expect(await this.token.name()).to.equal("SimpleToken");
  });

  it("has a symbol", async function() {
    expect(await this.token.symbol()).to.equal("ST");
  });

  it("has 18 decimals", async function() {
    expect(await this.token.decimals()).to.equal(18);
  });

  it("returns the total amount of tokens", async function () {
    expect(await this.token.totalSupply()).to.equal(0);
  });

  describe("Mint transactions", function () {
    
    beforeEach(async function () {
      this.mintTx = await this.token.connect(this.minter).mint(this.deployer.address, MINTED_AMOUNT);
    });

    it("confirms minter", async function() {
      expect(await this.token.hasRole(this.token.MINTER_ROLE(),
      this.minter.address)).to.equal(true);
    });

    it("emits Transfer event", async function () {
      expect(this.mintTx).to.emit(this.token, "Transfer").withArgs("0x0000000000000000000000000000000000000000", this.deployer.address, MINTED_AMOUNT);
    });

    it("increases total amount", async function () {
      expect(await this.token.totalSupply()).to.equal(MINTED_AMOUNT);
    });

    it("increases receiver's amount", async function() {
      expect(await this.token.balanceOf(this.deployer.address)).to.equal(MINTED_AMOUNT);
    });

    it ("declines access to unauthorised account", async function() {
      await expect(this.token.connect(this.stranger).mint(this.stranger.address, MINTED_AMOUNT)).to.be.reverted;
    });

    describe("Transfer transactions", function() {
  
      beforeEach(async function () {
        this.transferTx = await this.token.connect(this.deployer).transfer(this.counterparty.address, TRANSFERRED_AMOUNT);
      });
    
      it("emits Transfer event", async function () {
        await expect(this.transferTx).to.emit(this.token, "Transfer").withArgs(this.deployer.address, this.counterparty.address, TRANSFERRED_AMOUNT);
      });
    
      it("decreases sender's balance", async function () {
        expect(await this.token.balanceOf(this.deployer.address)).to.equal(MINTED_AMOUNT.sub(TRANSFERRED_AMOUNT));
      });
    
      it("increases receiver's balance ", async function () {
        expect(await this.token.balanceOf(this.counterparty.address)).to.equal(TRANSFERRED_AMOUNT);
      });
    
      it("reverts if sender has not enough balance", async function () {
        await expect(this.token.connect(this.stranger).transfer(this.counterparty.address, 1)).to.be.reverted;
      });
    });

    describe("Approve transactions", function () {
      beforeEach(async function () {
        this.approve = await this.token.connect(this.deployer).approve(this.representative.address, ALLOWANCE_AMOUNT);
      });
    
      it("emits Approval event ", async function () {
        await expect(this.approve).to.emit(this.token, "Approval").withArgs(this.deployer.address, this.representative.address, ALLOWANCE_AMOUNT);
      });
    
      it("returns allowance", async function () {
        expect(await this.token.allowance(this.deployer.address, this.representative.address)).to.equal(ALLOWANCE_AMOUNT);
      });

      describe("TransferFrom transactions", function () {
        
        beforeEach(async function () {
          this.deployerBalanceBefore = await this.token.balanceOf(this.deployer.address);
          this.transferFrom = await this.token.connect(this.representative).transferFrom(this.deployer.address, this.representative.address, ALLOWANCE_AMOUNT);
        })
      
        it("emits Transfer event", async function () {
          expect(this.transferFrom).to.emit(this.token, "Transfer").withArgs(this.deployer.address, this.representative.address, ALLOWANCE_AMOUNT);
        });
      
        it("returns zero allowance", async function () {
          expect(await this.token.allowance(this.deployer.address, this.stranger.address)).to.equal(0);
        });
      
        it("returns deployer balance after transfer", async function () {
          expect(await this.token.balanceOf(this.deployer.address)).to.equal(this.deployerBalanceBefore.sub(ALLOWANCE_AMOUNT));
        });
      
        it("reverts if not enough allowance", async function () {
          await expect(this.token.connect(this.stranger).transferFrom(this.deployer.address, this.counterparty.address, ALLOWANCE_AMOUNT)).to.be.reverted;
        });

      });
    });   
  });
});







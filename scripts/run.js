const main = async () => {
  const [owner, randomPerson] = await hre.ethers.getSigners();
  const domainContractFactory = await hre.ethers.getContractFactory("Domains");
  const domainContract = await domainContractFactory.deploy("pog");
  await domainContract.deployed();
  console.log("Contract deployed to:", domainContract.address);
  console.log("Contract deployed by:", owner.address);

  let txn = await domainContract.register("doom", {
    value: hre.ethers.utils.parseEther("10"),
  });
  await txn.wait();

  const domainOwner = await domainContract.getAddress("doom");
  console.log("Owner of domain doom:", domainOwner);

  const balance = await hre.ethers.provider.getBalance(domainContract.address);
  console.log("Contract balance:", hre.ethers.utils.formatEther(balance));

  txn = await domainContract.setRecord("doom", {
    username: "AnishDe12020",
    email: "contact@anishde.dev",
    twitter: "AnishDe12020",
    github: "AnishDe12020",
    website: "https://anishde.dev",
  });
  await txn.wait();

  const record = await domainContract.getRecord("doom");
  console.log("Record:", record);

  let ownerBalance = await hre.ethers.provider.getBalance(owner.address);
  console.log(
    "Balance of owner before withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );

  txn = await domainContract.connect(owner).withdraw();
  await txn.wait();

  const contractBalance = await hre.ethers.provider.getBalance(
    domainContract.address
  );
  ownerBalance = await hre.ethers.provider.getBalance(owner.address);

  console.log(
    "Contract balance after withdrawal:",
    hre.ethers.utils.formatEther(contractBalance)
  );
  console.log(
    "Balance of owner after withdrawal:",
    hre.ethers.utils.formatEther(ownerBalance)
  );
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();

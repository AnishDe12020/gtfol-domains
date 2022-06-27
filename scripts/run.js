const main = async () => {
	const [owner, randomPerson] = await hre.ethers.getSigners();
	const domainContractFactory = await hre.ethers.getContractFactory("Domains");
	const domainContract = await domainContractFactory.deploy("pog");
	await domainContract.deployed();
	console.log("Contract deployed to:", domainContract.address);
	console.log("Contract deployed by:", owner.address);

	let txn = await domainContract.register("gm", {
		value: hre.ethers.utils.parseEther("0.1"),
	});
	await txn.wait();

	const domainOwner = await domainContract.getAddress("gm");
	console.log("Owner of domain gm:", domainOwner);

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

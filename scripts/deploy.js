const main = async () => {
	const domainContractFactory = await hre.ethers.getContractFactory("Domains");
	const domainContract = await domainContractFactory.deploy("pog");
	await domainContract.deployed();

	console.log("Contract deployed to:", domainContract.address);

	let txn = await domainContract.register("solana", {
		value: hre.ethers.utils.parseEther("0.01"),
	});
	await txn.wait();
	console.log("Minted domain solana.ninja");

	txn = await domainContract.setRecord("solana", {
		username: "solana",
		email: "contact@anishde.dev",
		twitter: "solana",
		github: "solana-labs",
		website: "https://solana.com/",
	});
	await txn.wait();
	console.log("Set record for solana.pog");

	const address = await domainContract.getAddress("solana");
	console.log("Owner of domain banana:", address);

	const balance = await hre.ethers.provider.getBalance(domainContract.address);
	console.log("Contract balance:", hre.ethers.utils.formatEther(balance));
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

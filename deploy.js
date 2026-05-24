const path = require('path');
const fs = require('fs');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

async function main() {
    const contractPath = path.resolve(__dirname, 'PesaCoin.sol');
    const source = fs.readFileSync(contractPath, 'utf8');

    const input = {
        language: 'Solidity',
        sources: {
            'PesaCoin.sol': {
                content: source,
            },
        },
        settings: {
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode'],
                },
            },
        },
    };

    // Helper to resolve OpenZeppelin imports
    const findImports = (importPath) => {
        if (importPath.startsWith('@openzeppelin')) {
            return {
                contents: fs.readFileSync(path.resolve(__dirname, 'node_modules', importPath), 'utf8')
            };
        }
        return { error: 'File not found' };
    };

    console.log('Compiling...');
    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
    
    if (output.errors) {
        output.errors.forEach(err => console.error(err.formattedMessage));
        if (output.errors.some(err => err.severity === 'error')) process.exit(1);
    }

    const contractData = output.contracts['PesaCoin.sol']['PesaCoin'];
    const abi = contractData.abi;
    const bytecode = contractData.evm.bytecode.object;

    console.log('Deploying to blockchain...');
    const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
    const wallet = new ethers.Wallet(process.env.TREASURY_PRIVATE_KEY, provider);
    const factory = new ethers.ContractFactory(abi, bytecode, wallet);

    const contract = await factory.deploy();
    await contract.waitForDeployment();

    const address = await contract.getAddress();
    console.log(`PesaCoin deployed to: ${address}`);
    console.log('Update your .env file with this address.');
}

main().catch(console.error);

import Web3 from 'web3';
import * as ZombieFactoryJSON from '../../../build/contracts/ZombieFactory.json';
import { ZombieFactory } from '../../types/ZombieFactory';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class ZombieFactoryWrapper {
    web3: Web3;

    contract: ZombieFactory;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(ZombieFactoryJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getZombiesSize(fromAddress: string) {
        // const data = await this.contract.methods.get().call({ from: fromAddress });
        const data = await this.contract.methods.getZombiesSize().call({ from: fromAddress });

        return parseInt(data, 10);
    }


    async getLatestZombie(fromAddress: string) {
        const data = await this.contract.methods.getLatestZombie().call({ from: fromAddress });

        return data;
    }

    async createRandomZombie(name: string, fromAddress: string) {
        // const tx = await this.contract.methods.set(value).send({
        //     ...DEFAULT_SEND_OPTIONS,
        //     from: fromAddress,
        //     value
        // });
        const tx = await this.contract.methods.createRandomZombie(name).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
            // value
        });
        
        return tx;
    }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: ZombieFactoryJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}


import { expect } from "chai"
import { Bytecode } from '../src/solc/bytecode'

describe("bytecode unit test", () => {

    let TestByteCode01: Bytecode
    let TestDeployByteCode01: Bytecode

    beforeEach("deploy ByteCode", async () => {
        TestByteCode01 = new Bytecode(`608060405234801561001057600080fd5b5060ac8061001f6000396000f3fe6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d14604f575b600080fd5b603d606b565b60408051918252519081900360200190f35b606960048036036020811015606357600080fd5b50356071565b005b60005490565b60005556fea264697066735822122011891de1891192ad7d784a4b314e9d098e75d0d1d31ec33ada031a31852d6deb64736f6c63430007060033`)
        TestDeployByteCode01 = new Bytecode(`6080604052348015600f57600080fd5b506004361060325760003560e01c80632e64cec11460375780636057361d14604f575b600080fd5b603d606b565b60408051918252519081900360200190f35b606960048036036020811015606357600080fd5b50356071565b005b60005490565b60005556fea264697066735822122011891de1891192ad7d784a4b314e9d098e75d0d1d31ec33ada031a31852d6deb64736f6c63430007060033`)
    })

    describe("executable section", () => {
        it("bytecode shoud be include deployBytecode", async () => {
            await expect(TestByteCode01.getExecutableSection()).to.contain(TestDeployByteCode01.getExecutableSection());
        })

        it("version compare", async () => {
            await expect(TestByteCode01.getInferredSolcVersion()).to.equal(TestDeployByteCode01.getInferredSolcVersion()).to.equal("0.7.6");
        });
    })
})

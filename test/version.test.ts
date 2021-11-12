
import { expect } from "chai"
import { getLongVersion,getShortVersion } from '../src/solc/version'

describe("solc version unit test", () => {

    it("getLongVersion", async () => {
        await expect(getLongVersion("soljson-v0.4.15+commit.8b45bddb.js")).to.equal("0.4.15+commit.8b45bddb");
    })

    it("getShortVersion", async () => {
        await expect(getShortVersion("0.7.6+commit.7338295f")).to.equal("0.7.6");
    })
})
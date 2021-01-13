import { read_file } from "../../src/file"
import { read_json } from "../../src/file"

import { join } from "path"
import assert from "assert"

describe("read_file", () => {
	it("random file", async () => {
		const random = await read_file(join(__dirname, "assets/random.txt"))
		assert.equal(random, "uiiGIRf3N01+vXme\n")
	})
})

describe("read_json", () => {
	it("empty json object", async () => {
		const empty = await read_json(join(__dirname, "assets/empty.json"))
		assert.deepEqual(empty, { })
	})
})

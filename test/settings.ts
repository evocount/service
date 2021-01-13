import { load } from "../src/settings"
import { Settings } from "../src/settings"

import assert from "assert"

describe("load settings", () => {
	it("default settings", async () => {
		const settings = await load("a2CBjT38LPI6cme9")
		assert.deepEqual(settings, new Settings({ }))
	})
})

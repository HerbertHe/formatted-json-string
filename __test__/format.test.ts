import { test } from "vitest"
import { FormattedJSONString } from "../src"

test("test format", () => {
    const res = new FormattedJSONString(
        `{ "key": "value", "key2": "value2", "key3": [{
            "key31": "value31"
        }, {
            "key32": "value32"
        }] }`
    ).format()
    console.log(res)
})

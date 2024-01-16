import { pre_remove_newline, pre_remove_space } from "./utils"

export interface IFormattedJSONStringOptions {
    indent_style?: "space" | "tab"
    indent_size?: 2 | 4
    end_of_line?: "LF" | "CRLF"
    insert_final_newline?: boolean
}

export class FormattedJSONString {
    private _options: Required<IFormattedJSONStringOptions> = {
        indent_style: "space",
        indent_size: 2,
        end_of_line: "LF",
        insert_final_newline: true,
    }

    private _indent_count: number = 0
    private _const_indent_space: string = "  "

    private _raw: string = ""
    private _result: string = ""

    constructor(raw: string, options?: IFormattedJSONStringOptions) {
        this._options = { ...this._options, ...options }

        this._raw = pre_remove_space(pre_remove_newline(raw))
    }

    private _get_newline = () => {
        return this._options.end_of_line === "LF" ? "\n" : "\r\n"
    }

    private _get_indent = () => {
        return this._options.indent_style === "space"
            ? this._const_indent_space.repeat(
                  (this._indent_count * this._options.indent_size) / 2
              )
            : "\t"
    }

    format = () => {
        for (let i = 0; i < this._raw.length; i++) {
            const before = this._raw[i - 1]
            const next = this._raw[i + 1]
            switch (this._raw[i]) {
                case "{":
                case "[": {
                    this._result +=
                        (before === ":"
                            ? " "
                            : ["{", "[", ","].includes(before)
                            ? ""
                            : this._get_indent()) + this._raw[i]

                    this._indent_count++

                    if (next === `"`) {
                        this._result +=
                            this._get_newline() +
                            this._get_indent() +
                            this._raw[++i]
                    }

                    break
                }

                case "}":
                case "]": {
                    this._indent_count--
                    this._result +=
                        this._get_newline() + this._get_indent() + this._raw[i]
                    break
                }

                case ",": {
                    if (!["{", "["].includes(next)) {
                        this._result += this._raw[i] + this._get_newline()
                    } else {
                        this._result += this._raw[i]
                    }

                    if (next === `"`) {
                        this._result += this._get_indent() + this._raw[++i]
                    }

                    break
                }

                case ":": {
                    if (!["{", "["].includes(next)) {
                        this._result += this._raw[i] + " "
                    } else {
                        this._result += this._raw[i]
                    }

                    break
                }

                default:
                    this._result += this._raw[i]
                    break
            }
        }

        return this._options.insert_final_newline
            ? this._result + this._get_newline()
            : this._result
    }
}

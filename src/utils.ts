export const pre_remove_newline = (s: string) => {
    return s.replace(/\r?\n/g, "")
}

export const pre_remove_space = (s: string) => {
    return s.replace(/ +/g, "")
}

export function camelize(str: String) {
    return str.replace(/^([a-z])|((?:[\s_])[a-z])/g, function (match, _index) {
        if (+match === 0) { return ""; } // or if (/\s+/.test(match)) for white spaces
        return match.toUpperCase().replace(/[\s_]/g, (_, __) => "");
    });
}

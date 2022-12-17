function colorConsole(string) {
    const colors = ['&0', '&1', '&2', '&3', '&4', '&5', '&6', '&7', '&8', '&9', '&a', '&b', '&c', '&d', '&e', '&f', '&l', '&n', '&r']
    const colors_ = ['30', '94', '32', '36', '31', '35', '33', '37', '90', '34', '92', '96', '91', '95', '93', '97', '1', '4', '0']
    for (var i = 0; i < colors.length; i++) string = string.replaceAll(colors[i], `\u001b[${colors_[i]}m`)
    return string + '\u001b[0m'
}

module.exports = { colorConsole }
const { promisify } = require('util')
const { glob } = require('glob')
const _glob = promisify(glob)

async function loadFiles(dirName) {
    const files = await _glob(`${process.cwd().replace(/\\/g, '/')}/${dirName}/**/*.js`)
    files.forEach(file => delete require.cache[require.resolve(file)])
    return files
}

module.exports = { loadFiles }
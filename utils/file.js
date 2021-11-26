const fs = require('fs');
const rootPath = process.cwd();

module.exports = {
    existFile(filePath) {
		const fileCheck = fs.existsSync(rootPath + filePath);
		
		return fileCheck;
	},
    readFile(filePath) {
		const buffer = fs.readFileSync(rootPath + filePath);
		const data = buffer.toString();

		return data;
	},
    readFileDir(path) {
        return fs.readdirSync(rootPath + path);
    }
}
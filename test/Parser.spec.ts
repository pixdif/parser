import fs from 'fs';
import { Readable } from 'stream';

import Parser, { sha1 } from '../src';

class SingleImageParser extends Parser {
	async openFile(): Promise<number> {
		if (fs.existsSync(this.filePath)) {
			return 1;
		}
		return 0;
	}

	async closeFile(): Promise<void> {
		this.filePath = '';
	}

	override async getName(index: number): Promise<string | undefined> {
		if (index === 0) {
			return this.filePath;
		}
	}

	override async getImage(index: number): Promise<Readable> {
		if (index === 0) {
			return fs.createReadStream(this.filePath);
		}
		throw new Error(`Out of bound: ${index}`);
	}
}

test('Open an image', async () => {
	const input = 'test/sample/pixdif.png';
	const parser = new SingleImageParser(input);
	const openFile = jest.spyOn(parser, 'openFile');
	expect(await parser.getFingerprint()).toBe(await sha1(input));
	const num = await parser.open();
	expect(num).toBe(1);
	expect(openFile).toBeCalledTimes(1);
});

test('Read a non-existing image', async () => {
	const parser = new SingleImageParser('n');
	const num = await parser.open();
	expect(num).toBe(0);

	const closeFile = jest.spyOn(parser, 'closeFile');
	await parser.close();
	expect(closeFile).toBeCalledTimes(1);
});

import fs from 'fs';
import { Readable } from 'stream';

import Parser, { sha1 } from '../src';

class SingleImageParser extends Parser {
	async open(): Promise<number> {
		if (fs.existsSync(this.filePath)) {
			return 1;
		}
		return 0;
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
	expect(await parser.getFingerprint()).toBe(await sha1(input));
	const num = await parser.open();
	expect(num).toBe(1);
});

test('Read a non-existing image', async () => {
	const parser = new SingleImageParser('n');
	const num = await parser.open();
	expect(num).toBe(0);
});

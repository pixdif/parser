import fs from 'fs';

import Parser from '../src';

class SingleImageParser extends Parser {
	protected async open(): Promise<number> {
		if (fs.existsSync(this.inputPath)) {
			return 1;
		}
		return 0;
	}

	protected async convert(current: number): Promise<string> {
		if (current === 0) {
			return this.inputPath;
		}
		return '';
	}
}

test('Open an image', async () => {
	const input = 'test/sample/pixdif.png';
	const parser = new SingleImageParser(input);
	expect(await parser.getFingerprint()).toBe('8146e23fba5a735be6caa20aaa8e4300691a1831');
	const files = await parser.exec();
	expect(files).toHaveLength(1);
	expect(files).toContain(input);
});

test('Set output path', () => {
	const parser = new SingleImageParser('n', { outputPath: 'a' });
	expect(parser.getOutputPath()).toBe('a');
});

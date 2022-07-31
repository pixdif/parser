import { EventEmitter } from 'events';
import { Progress } from '@pixdif/model';

import ParserOptions from './ParserOptions';
import sha1 from './util/sha1';

interface Parser {
	on(event: 'open', listener: () => void): this;
	on(event: 'progress', listener: (progress: Progress) => void): this;
	on(event: 'close', listener: () => void): this;

	once(event: 'open', listener: () => void): this;
	once(event: 'progress', listener: (progress: Progress) => void): this;
	once(event: 'close', listener: () => void): this;

	off(event: 'open', listener: () => void): this;
	off(event: 'progress', listener: (progress: Progress) => void): this;
	off(event: 'close', listener: () => void): this;

	emit(event: 'open'): this;
	emit(event: 'progress', progress: Progress): boolean;
	emit(event: 'close'): this;
}

abstract class Parser extends EventEmitter {
	protected inputPath: string;

	protected outputPath?: string;

	constructor(inputPath: string, options?: ParserOptions) {
		super();

		this.inputPath = inputPath;
		this.outputPath = options?.outputPath;
	}

	/**
	 * @returns output path
	 */
	getOutputPath(): string | undefined {
		return this.outputPath;
	}

	/**
	 * @returns Fingerprint of the input
	 */
	getFingerprint(): Promise<string> {
		return sha1(this.inputPath);
	}

	/**
	 * @return All files of converted images
	 */
	async exec(): Promise<string[]> {
		this.emit('open');
		const limit = await this.open();
		const files: string[] = [];
		for (let i = 0; i < limit; i++) {
			const file = await this.convert(i);
			files.push(file);
			this.emit('progress', {
				current: i,
				limit,
			});
		}
		this.emit('close');
		return files;
	}

	/**
	 * Open the input file.
	 * @returns progress limit
	 */
	protected abstract open(): Promise<number>;

	/**
	 * Convert the current part into an image.
	 * @param current current progress
	 * @returns image buffer
	 */
	protected abstract convert(current: number): Promise<string>;
}

export default Parser;

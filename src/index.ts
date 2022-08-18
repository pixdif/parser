import { EventEmitter } from 'events';
import { Readable } from 'stream';

import sha1 from './util/sha1';

interface Parser {
	on(event: 'open', listener: () => void): this;
	on(event: 'close', listener: () => void): this;

	once(event: 'open', listener: () => void): this;
	once(event: 'close', listener: () => void): this;

	off(event: 'open', listener: () => void): this;
	off(event: 'close', listener: () => void): this;

	emit(event: 'open'): boolean;
	emit(event: 'close'): boolean;
}

abstract class Parser extends EventEmitter {
	protected filePath: string;

	constructor(filePath: string) {
		super();

		this.filePath = filePath;
	}

	/**
	 * @returns Fingerprint of the input
	 */
	getFingerprint(): Promise<string> {
		return sha1(this.filePath);
	}

	/**
	 * Open the input file.
	 * @returns progress limit
	 */
	abstract open(): Promise<number>;

	/**
	 * Convert the current part into an image.
	 * @param index current progress
	 * @returns image buffer
	 */
	abstract getImage(index: number): Promise<Readable>;
}

export default Parser;

import { EventEmitter } from 'events';
import { Readable } from 'stream';

import sha1 from './util/sha1';

export { default as sha1 } from './util/sha1';

export interface Parser {
	on(event: 'open', listener: () => void): this;
	on(event: 'close', listener: () => void): this;

	once(event: 'open', listener: () => void): this;
	once(event: 'close', listener: () => void): this;

	off(event: 'open', listener: () => void): this;
	off(event: 'close', listener: () => void): this;

	emit(event: 'open'): boolean;
	emit(event: 'close'): boolean;
}

export abstract class Parser extends EventEmitter {
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
	async open(): Promise<number> {
		const pageNum = await this.openFile();
		this.emit('open');
		return pageNum;
	}

	/**
	 * Close the file and release resources.
	 */
	async close(): Promise<void> {
		await this.closeFile();
		this.emit('close');
	}

	/**
	 * Internal implementation of open().
	 */
	protected abstract openFile(): Promise<number>;

	/**
	 * Internal implementation of close().
	 */
	protected abstract closeFile(): Promise<void>;

	/**
	 * Gets the name of the nth image.
	 * @param index image index
	 * @returns image name
	 */
	abstract getName(index: number): Promise<string | undefined>;

	/**
	 * Gets a readable stream of the nth image.
	 * @param index image index
	 * @returns readable stream
	 */
	abstract getImage(index: number): Promise<Readable>;
}

export default Parser;

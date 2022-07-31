import sha1 from '../../src/util/sha1';

test('Calculate SHA1 fingerprint', async () => {
	const fingerprint = await sha1('test/sample/pixdif.png');
	expect(fingerprint).toBe('8146e23fba5a735be6caa20aaa8e4300691a1831');
});

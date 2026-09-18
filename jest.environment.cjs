const {
	default: TestEnvironment,
} = require('@jest/environment-jsdom-abstract');
const jsdom = require('jsdom');
const native = Object.fromEntries(
	[
		'fetch',
		'Request',
		'Response',
		'Headers',
		'FormData',
		'Blob',
		'TextEncoder',
		'TextDecoder',
		'ReadableStream',
		'WritableStream',
		'TransformStream',
		'BroadcastChannel',
	].map(name => [name, globalThis[name]]),
);
module.exports = class BrowserTestEnvironment extends TestEnvironment {
	constructor(config, context) {
		super(config, context, jsdom);
	}
	async setup() {
		await super.setup();
		Object.assign(this.global, native);
	}
};

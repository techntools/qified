import {
	type TopicHandler, type MessageProvider, type TaskProvider, type Message,
} from './types.js';

export type QifiedOptions = {
	/**
	 * The message providers to use.
	 */
	messageProviders?: MessageProvider[];

	/**
	 * The task providers to use.
	 */
	taskProviders?: TaskProvider[];
};

export class Qified {
	private _messageProviders: MessageProvider[] = [];
	/**
	 * Creates an instance of Qified.
	 * @param {QifiedOptions} options - Optional configuration for Qified.
	 */
	constructor(options?: QifiedOptions) {
		if (options?.messageProviders) {
			this._messageProviders = options.messageProviders;
		}
	}

	/**
	 * Gets or sets the message providers.
	 * @returns {MessageProvider[]} The array of message providers.
	 */
	public get messageProviders(): MessageProvider[] {
		return this._messageProviders;
	}

	/**
	 * Sets the message providers.
	 * @param {MessageProvider[]} providers - The array of message providers to set.
	 */
	public set messageProviders(providers: MessageProvider[]) {
		this._messageProviders = providers;
	}

	/**
	 * Subscribes to a topic. If you have multiple message providers, it will subscribe to the topic on all of them.
	 * @param {string} topic - The topic to subscribe to.
	 * @param {TopicHandler} handler - The handler to call when a message is published to the topic.
	 */
	public async subscribe(topic: string, handler: TopicHandler): Promise<void> {
		const promises = this._messageProviders.map(async provider => provider.subscribe(topic, handler));
		await Promise.all(promises);
	}

	/**
	 * Publishes a message to a topic. If you have multiple message providers, it will publish the message to all of them.
	 * @param {string} topic - The topic to publish to.
	 * @param {Message} message - The message to publish.
	 */
	public async publish(topic: string, message: Message): Promise<void> {
		const promises = this._messageProviders.map(async provider => provider.publish(topic, message));
		await Promise.all(promises);
	}

	/**
	 * Unsubscribes from a topic. If you have multiple message providers, it will unsubscribe from the topic on all of them.
	 * If an ID is provided, it will unsubscribe only that handler. If no ID is provided, it will unsubscribe all handlers for the topic.
	 * @param topic - The topic to unsubscribe from.
	 * @param id - The optional ID of the handler to unsubscribe. If not provided, all handlers for the topic will be unsubscribed.
	 */
	public async unsubscribe(topic: string, id?: string): Promise<void> {
		const promises = this._messageProviders.map(async provider => provider.unsubscribe(topic, id));
		await Promise.all(promises);
	}

	/**
	 * Disconnects from all providers.
	 * This method will call the `disconnect` method on each message provider.
	 */
	public async disconnect(): Promise<void> {
		const promises = this._messageProviders.map(async provider => provider.disconnect());
		await Promise.all(promises);
		this._messageProviders = [];
	}
}

export {MemoryMessageProvider} from './memory/message.js';
export {
	type TopicHandler, type MessageProvider, type TaskProvider, type Message,
} from './types.js';

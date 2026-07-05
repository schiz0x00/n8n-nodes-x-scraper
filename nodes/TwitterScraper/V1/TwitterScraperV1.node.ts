import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeParameterResourceLocator,
	INodeType,
	INodeTypeBaseDescription,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { tweetFields, tweetOperations } from './TweetDescription';
import { userFields, userOperations } from './UserDescription';

import { Rettiwt, TweetFilter } from 'rettiwt-api';
import type { INewTweetMedia } from 'rettiwt-api';
import { returnId } from './GenericFunctions';

export class TwitterScraperV1 implements INodeType {
	description: INodeTypeDescription;

	constructor(baseDescription: INodeTypeBaseDescription) {
		this.description = {
			...baseDescription,

			version: 1,
			defaults: {
				name: 'Twitter Scraper',
			},
			inputs: [NodeConnectionTypes.Main],
			outputs: [NodeConnectionTypes.Main],
			credentials: [
				{
					name: 'twitterScraperApi',
					required: true,
				},
			],
			properties: [
				{
					displayName: 'Resource',
					name: 'resource',
					type: 'options',
					noDataExpression: true,
					options: [
						{
							name: 'Tweet',
							value: 'tweet',
							description: 'Interact with tweets',
						},
						{
							name: 'User',
							value: 'user',
							description: 'Interact with users',
						},
					],
					default: 'tweet',
				},
				...tweetOperations,
				...tweetFields,
				...userOperations,
				...userFields,
			],
		};
	}

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const length = items.length;
		const returnData: INodeExecutionData[] = [];

		let responseData;

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		const credentials = await this.getCredentials('twitterScraperApi');

		const rettiwt = new Rettiwt({ apiKey: credentials.apiKey as string });

		for (let i = 0; i < length; i++) {
			try {
				if (resource === 'tweet') {
					if (operation === 'delete') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.unpost(tweetId);
					}

					if (operation === 'create') {
						const text = this.getNodeParameter('text', i, '', {});

						const { mediaId, inReplyToStatusId, quoteId } = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as {
							mediaId: string;
							inReplyToStatusId: INodeParameterResourceLocator;
							quoteId: string;
						};

						let inReplyToStatusIdValue: string | undefined;
						if (inReplyToStatusId) {
							inReplyToStatusIdValue = returnId(inReplyToStatusId);
						}

						let attachmentsValue: INewTweetMedia[] | undefined;
						if (mediaId) {
							attachmentsValue = [{ id: mediaId }];
						}

						const tweetId = await rettiwt.tweet.post({
							text: text as string,
							media: attachmentsValue,
							replyTo: inReplyToStatusIdValue,
							quote: quoteId || undefined,
						});

						responseData = { tweetId };
					}

					if (operation === 'uploadMedia') {
						const binaryPropertyName = this.getNodeParameter(
							'binaryPropertyName',
							i,
							'',
							{},
						) as string;

						const binaryBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
						const mediaId = await rettiwt.tweet.upload(binaryBuffer as unknown as ArrayBuffer);

						responseData = { mediaId };
					}

					if (operation === 'retweet') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.retweet(tweetId);
					}

					if (operation === 'unretweet') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.unretweet(tweetId);
					}

					if (operation === 'like') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.like(tweetId);
					}

					if (operation === 'unlike') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.unlike(tweetId);
					}

					if (operation === 'details') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.details(tweetId);
					}

					if (operation === 'replies') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);

						const { sortBy, cursor } = this.getNodeParameter(
							'additionalFields',
							i,
							{},
						) as {
							sortBy: string;
							cursor: string;
						};

						responseData = await rettiwt.tweet.replies(tweetId, cursor || undefined, sortBy as any);
					}

					if (operation === 'likers') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						const limit = this.getNodeParameter('limit', i) as number;

						responseData = await rettiwt.tweet.likers(tweetId, limit);
					}

					if (operation === 'retweeters') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						const limit = this.getNodeParameter('limit', i) as number;

						responseData = await rettiwt.tweet.retweeters(tweetId, limit);
					}

					if (operation === 'history') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.history(tweetId);
					}

					if (operation === 'bookmark') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.bookmark(tweetId);
					}

					if (operation === 'unbookmark') {
						const tweetRLC = this.getNodeParameter(
							'tweetId',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const tweetId = returnId(tweetRLC);
						responseData = await rettiwt.tweet.unbookmark(tweetId);
					}

					if (operation === 'search') {
						const searchText = this.getNodeParameter('searchText', i, '', {});
						const limit = this.getNodeParameter('limit', i);

						const {
							startTime,
							endTime,
							fromUsers,
							toUsers,
							hashtags,
							mentions,
							excludeWords,
							includeWords,
							optionalWords,
							language,
							minLikes,
							minRetweets,
							minReplies,
							searchTop,
							onlyLinks,
							onlyText,
							onlyOriginal,
							onlyReplies,
						} = this.getNodeParameter('additionalFields', i, {}) as {
							startTime: string;
							endTime: string;
							fromUsers: string;
							toUsers: string;
							hashtags: string;
							mentions: string;
							excludeWords: string;
							includeWords: string;
							optionalWords: string;
							language: string;
							minLikes: number;
							minRetweets: number;
							minReplies: number;
							searchTop: boolean;
							onlyLinks: boolean;
							onlyText: boolean;
							onlyOriginal: boolean;
							onlyReplies: boolean;
						};

						const tweetFilter: TweetFilter = {};

						if (searchText) {
							tweetFilter.includePhrase = searchText.toString();
						}

						if (startTime) {
							tweetFilter.startDate = new Date(startTime);
						}

						if (endTime) {
							tweetFilter.endDate = new Date(endTime);
						}

						if (fromUsers) {
							tweetFilter.fromUsers = fromUsers.split(',').map(u => u.trim()).filter(Boolean);
						}

						if (toUsers) {
							tweetFilter.toUsers = toUsers.split(',').map(u => u.trim()).filter(Boolean);
						}

						if (hashtags) {
							tweetFilter.hashtags = hashtags.split(',').map(h => h.trim()).filter(Boolean);
						}

						if (mentions) {
							tweetFilter.mentions = mentions.split(',').map(m => m.trim()).filter(Boolean);
						}

						if (excludeWords) {
							tweetFilter.excludeWords = excludeWords.split(',').map(w => w.trim()).filter(Boolean);
						}

						if (includeWords) {
							tweetFilter.includeWords = includeWords.split(',').map(w => w.trim()).filter(Boolean);
						}

						if (optionalWords) {
							tweetFilter.optionalWords = optionalWords.split(',').map(w => w.trim()).filter(Boolean);
						}

						if (language) {
							tweetFilter.language = language;
						}

						if (minLikes) {
							tweetFilter.minLikes = minLikes;
						}

						if (minRetweets) {
							tweetFilter.minRetweets = minRetweets;
						}

						if (minReplies) {
							tweetFilter.minReplies = minReplies;
						}

						if (searchTop) {
							tweetFilter.top = searchTop;
						}

						if (onlyLinks) {
							tweetFilter.onlyLinks = onlyLinks;
						}

						if (onlyText) {
							tweetFilter.onlyText = onlyText;
						}

						if (onlyOriginal) {
							tweetFilter.onlyOriginal = onlyOriginal;
						}

						if (onlyReplies) {
							tweetFilter.onlyReplies = onlyReplies;
						}

						responseData = await rettiwt.tweet.search(tweetFilter, limit);
					}
				}

				if (resource === 'user') {
					if (operation === 'getUser') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						responseData = await rettiwt.user.details(username.value as string);
					}

					if (operation === 'about') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						responseData = await rettiwt.user.about(username.value as string);
					}

					if (operation === 'getTimeline') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.timeline(userData.id, limit);
					}

					if (operation === 'followers') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.followers(userData.id, limit);
					}

					if (operation === 'following') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.following(userData.id, limit);
					}

					if (operation === 'media') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.media(userData.id, limit);
					}

					if (operation === 'highlights') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.highlights(userData.id, limit);
					}

					if (operation === 'replies') {
						const username = this.getNodeParameter(
							'user',
							i,
							'',
							{},
						) as INodeParameterResourceLocator;

						const limit = this.getNodeParameter('limit', i);

						const userData = await rettiwt.user.details(username.value as string);

						if (!userData) {
							throw new NodeOperationError(this.getNode(), 'User not found');
						}

						responseData = await rettiwt.user.replies(userData.id, limit);
					}

					if (operation === 'likes') {
						const limit = this.getNodeParameter('limit', i);

						responseData = await rettiwt.user.likes(limit);
					}

					if (operation === 'search') {
						const searchText = this.getNodeParameter('searchText', i, '', {}) as string;
						const limit = this.getNodeParameter('limit', i);

						responseData = await rettiwt.user.search(searchText, limit);
					}

					if (operation === 'follow') {
						const userId = this.getNodeParameter('userId', i, '', {}) as string;

						responseData = await rettiwt.user.follow(userId);
					}

					if (operation === 'unfollow') {
						const userId = this.getNodeParameter('userId', i, '', {}) as string;

						responseData = await rettiwt.user.unfollow(userId);
					}
				}

				const executionData = this.helpers.constructExecutionMetaData(
					this.helpers.returnJsonArray(responseData as unknown as IDataObject[]),
					{ itemData: { item: i } },
				);

				returnData.push(...executionData);

			} catch (error) {
				if (this.continueOnFail()) {
					const executionErrorData = {
						json: {
							error: (error as JsonObject).message,
						},
					};
					returnData.push(executionErrorData);
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

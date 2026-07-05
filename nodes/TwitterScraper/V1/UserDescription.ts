import type { INodeProperties } from 'n8n-workflow';

export const userOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['user'],
			},
		},
		options: [
			{
				name: 'About',
				value: 'about',
				description: "Get a user's about/profile bio",
				action: 'Get user about',
			},
			{
				name: 'Follow',
				value: 'follow',
				description: 'Follow a user',
				action: 'Follow user',
			},
			{
				name: 'Followers',
				value: 'followers',
				description: "Get a user's followers",
				action: 'Get user followers',
			},
			{
				name: 'Following',
				value: 'following',
				description: "Get who a user follows",
				action: 'Get user following',
			},
			{
				name: 'Get',
				value: 'getUser',
				description: 'Retrieve a user by username',
				action: 'Get user',
			},
			{
				name: 'Get Timeline',
				value: 'getTimeline',
				description: "Retrieve a user's timeline",
				action: 'Get user timeline',
			},
			{
				name: 'Highlights',
				value: 'highlights',
				description: "Get a user's highlighted tweets",
				action: 'Get user highlights',
			},
			{
				name: 'Likes',
				value: 'likes',
				description: 'Get tweets liked by the logged-in user',
				action: 'Get user likes',
			},
			{
				name: 'Media',
				value: 'media',
				description: "Get a user's media tweets",
				action: 'Get user media',
			},
			{
				name: 'Replies',
				value: 'replies',
				description: "Get a user's reply timeline",
				action: 'Get user replies',
			},
			{
				name: 'Search',
				value: 'search',
				description: 'Search for users by username',
				action: 'Search users',
			},
			{
				name: 'Unfollow',
				value: 'unfollow',
				description: 'Unfollow a user',
				action: 'Unfollow user',
			},
		],
		default: 'getUser',
	},
];

export const userFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                user:getUser                                */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User',
		name: 'user',
		type: 'resourceLocator',
		default: { mode: 'username', value: '' },
		required: true,
		description: 'The user you want to search',
		displayOptions: {
			show: {
				operation: ['getUser', 'about'],
				resource: ['user'],
			},
		},
		modes: [
			{
				displayName: 'By Username',
				name: 'username',
				type: 'string',
				validation: [],
				placeholder: 'e.g. n8n',
				url: '',
			},
		],
	},

	/* -------------------------------------------------------------------------- */
	/*                      user:getTimeline / media / highlights                 */
	/*                          followers / following / replies                   */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User',
		name: 'user',
		type: 'resourceLocator',
		default: { mode: 'username', value: '' },
		required: true,
		description: 'The user you want to search',
		displayOptions: {
			show: {
				operation: ['getTimeline', 'media', 'highlights', 'followers', 'following', 'replies'],
				resource: ['user'],
			},
		},
		modes: [
			{
				displayName: 'By Username',
				name: 'username',
				type: 'string',
				validation: [],
				placeholder: 'e.g. n8n',
				url: '',
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		description: 'Max number of results to return',
		type: 'number',
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 20,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['getTimeline', 'media', 'highlights', 'followers', 'following', 'replies'],
				resource: ['user'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                user:follow / unfollow                      */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		default: '',
		required: true,
		description: 'The ID of the user to follow/unfollow',
		displayOptions: {
			show: {
				operation: ['follow', 'unfollow'],
				resource: ['user'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                user:likes                                  */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Limit',
		name: 'limit',
		description: 'Max number of results to return',
		type: 'number',
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 20,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['likes'],
				resource: ['user'],
			},
		},
	},

	/* -------------------------------------------------------------------------- */
	/*                                user:search                                 */
	/* -------------------------------------------------------------------------- */
	{
		displayName: 'Search Text',
		name: 'searchText',
		type: 'string',
		default: '',
		placeholder: 'e.g. john',
		required: true,
		displayOptions: {
			show: {
				operation: ['search'],
				resource: ['user'],
			},
		},
		description: 'The username to search for',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		description: 'Max number of results to return',
		type: 'number',
		// eslint-disable-next-line n8n-nodes-base/node-param-default-wrong-for-limit
		default: 10,
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				operation: ['search'],
				resource: ['user'],
			},
		},
	},
];

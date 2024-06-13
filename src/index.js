/* searchspring imports */
import { Snap } from '@searchspring/snap-preact';
import { getContext } from '@searchspring/snap-toolbox';

/* local imports */
import { plugin } from './scripts/plugin';
import './styles/custom.scss';

/*
	context and background filtering
 */

const context = getContext(['collection', 'shopper', 'metaImagesAndVideos']);

let backgroundFilters = [];
// if (context.collection?.handle) {
// 	backgroundFilters.push({
// 		field: 'collection_handle',
// 		value: context.collection.handle,
// 		type: 'value',
// 		background: true,
// 		metaImagesAndVideos: context.metaImagesAndVideos,
// 	});
// }
const collectionFilter = {
	field: 'collection_handle',
	value: 'jewelry-category-bracelets-bangle',
	type: 'value',
	background: true,
	metaImagesAndVideos: context.metaImagesAndVideos,
};
backgroundFilters.push(collectionFilter);
/*
	configuration and instantiation
 */

const config = {
	context,
	features: {
		integratedSpellCorrection: {
			enabled: true,
		},
	},
	url: {
		parameters: {
			core: {
				query: { name: 'q' },
			},
		},
	},
	client: {
		globals: {
			siteId: 'x585vl',
		},
	},
	instantiators: {
		recommendation: {
			components: {
				Default: async () => {
					return (await import('./components/Recommendations/Recs')).Recs;
				},
			},
			config: {
				branch: BRANCHNAME || 'production',
			},
		},
	},
	controllers: {
		search: [
			{
				config: {
					id: 'search',
					settings: {
						infinite: {
							backfill: 5,
						},
					},
					plugins: [[plugin]],
					globals: {
						filters: backgroundFilters,
						pagination: {
							pageSize: 40,
						},
					},
				},
				targeters: [
					{
						selector: '#searchspring-sidebar',
						component: async () => {
							return (await import('./components/Sidebar')).Sidebar;
						},
						hideTarget: true,
					},
					{
						selector: '#searchspring-content',
						component: async () => {
							return (await import('./components/Content')).Content;
						},
						hideTarget: true,
					},
					{
						selector: '#searchspring-header',
						component: async () => {
							return (await import('./components/SearchHeader')).SearchHeader;
						},
						hideTarget: true,
					},
				],
			},
		],
		autocomplete: [
			{
				config: {
					id: 'autocomplete',
					selector: '#search-input',
				},
				globals: {
					pagination: {
						pageSize: 6,
					},
				},
				targeters: [
					{
						selector: '#search-input',
						component: async () => {
							return (await import('./components/Autocomplete')).Autocomplete;
						},
					},
				],
			},
		],
	},
};

const snap = new Snap(config);

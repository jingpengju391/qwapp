import * as detailIndex from './path';
export default [
    {
        path: '/detail-page',
        name: 'detail-page',
        component: detailIndex.Shop,
        children:[
        	{
				path: '/detail-shop',
				name: 'detail-shop',
				component: detailIndex.DetailShop,
			},
			{
				path: '/message',
				name: 'message',
				component: detailIndex.Message,
			},
			{
				path: '/chat',
				name: 'chat',
				component: detailIndex.Chat,
			},
			{
				path: '/order',
				name: 'order',
				component: detailIndex.Order,
			},
			{
				path: '/friends',
				name: 'friends',
				component: detailIndex.Friends,
			},
			{
				path: '/dynamic',
				name: 'dynamic',
				component: detailIndex.Dynamic,
			},
			{
				path: '/passers',
				name: 'passers',
				component: detailIndex.Passers,
			},
			{
				path: '/order-way',
				name: 'order-way',
				component: detailIndex.OrderWay,
			},
			{
				path: '/collection',
				name: 'collection',
				component: detailIndex.Collection,
			},
			{
				path: '/version',
				name: 'version',
				component: detailIndex.Version,
			},
			{
				path: '/injection',
				name: 'injection',
				component: detailIndex.Injection,
			},
			{
				path: '/set-up',
				name: 'set-up',
				component: detailIndex.SetUp,
			},
			{
				path: '/certification',
				name: 'certification',
				component: detailIndex.Certification,
			},
			{
				path: '/personal-info',
				name: 'personal-info',
				component: detailIndex.PersonalInfo,
			}
        ]
    },
]

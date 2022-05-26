import * as viewsRouter from './path';
import home from './home';
export default [
	{
		path: '/home',
		name: 'home',
		component: viewsRouter.Home,
		children:[
			...home,
		]
	},
]

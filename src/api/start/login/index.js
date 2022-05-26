import ajax from '../../ajax';

const BASE = '/index.php/index/login/';

export default {
    /**
     * 手机号登陆
     * @param data
     */
    dengluphone: data => ajax(BASE + 'dengluphone', data, 'POST'),
	/**
	 * 账户登陆
	 * @param data
	 */
	login: data => ajax(BASE + 'login', data, 'POST'),
};


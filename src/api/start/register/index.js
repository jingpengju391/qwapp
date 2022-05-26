import ajax from '../../ajax';
import Jsonp from '../../jsonp';

const BASE = '/index.php/index/login/';

export default {
    /**
     * 注册
     * @param data
     */
    register: data => ajax(BASE + 'register', data, 'POST'),
	/**
	 * 注册
	 * @param data
	 */
	queryCityCode : data => Jsonp( 'http://api.map.baidu.com/geocoding/v3', data ),
};


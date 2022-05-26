import ajax from '../../ajax';

const 
BASE = '/index.php/index/login/',
BASE2 = '/index.php/index/index/';
export default {
    /**
     * 注册
     * @param data
     */
    index: data => ajax( BASE + 'index', data, 'POST' ),
	/**
	 * 注册
	 * @param data
	 */
	panshiming: data => ajax( BASE2 + 'panshiming', data, 'POST' ),
};


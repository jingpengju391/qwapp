import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/',
BASEP = '/index.php/index/login/';
export default {
    /**
     * @param data 
     */
    storedetailed: data => ajax( BASE + 'storedetailed', data, 'POST' ),
	/**
	 * @param data
	 */
	storedetails: data => ajax( BASE + 'storedetails', data, 'POST' ),
	/**
	 * @param data
	 */
	creatorder: data => ajax( BASE + 'creatorder', data, 'POST' ),
	/**
	 * @param data
	 */
	storelist: data => ajax( BASEP + 'storelist', data, 'POST' ),
	/**
	 * @param data
	 */
	carttotal: data => ajax( BASE + 'carttotal', data, 'POST' ),
};


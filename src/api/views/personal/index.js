import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/',
BASE2 = '/index.php/index/login/';
export default {
    /**
     * @param data 
     */
    collectlist: data => ajax( BASE + 'collectlist', data, 'POST' ),
	/**
	 * @param data 
	 */
	relievecollect: data => ajax( BASE + 'relievecollect', data, 'POST' ),
	/**
	 * @param data 
	 */
	bbandxgn: data => ajax( BASE2 + 'bbandxgn', data, 'POST' ),
	/**
	 * @param data 
	 */
	kefu: data => ajax( BASE2 + 'kefu', data, 'POST' ),
	/**
	 * @param data 
	 */
	suggestion: data => ajax( BASE + 'suggestion', data, 'POST' ),
	/**
	 * @param data 
	 */
	mycoupon: data => ajax( BASE + 'mycoupon', data, 'POST' ),
	/**
	 * @param data 
	 */
	yue: data => ajax( BASE + 'yue', data, 'POST' ),
	/**
	 * @param data 
	 */
	recharge: data => ajax( BASE + 'recharge', data, 'POST' ),
	/**
	 * @param data 
	 */
	rechargeOperation: data => ajax( BASE + 'rechargeOperation', data, 'POST' ),
	/**
	 * @param data 
	 */
	panshiming: data => ajax( BASE + 'panshiming', data, 'POST' ),
	/**
	 * @param data 
	 */
	shiming: data => ajax( BASE + 'shiming', data, 'POST' ),
	/**
	 * @param data 
	 */
	loversspace: data => ajax( BASE + 'loversspace', data, 'POST' ),
	/**
	 * @param data 
	 */
	deleteIntended: data => ajax( BASE + 'deleteIntended', data, 'POST' ),
	/**
	 * @param data 
	 */
	intendedlist: data => ajax( BASE + 'intendedlist', data, 'POST' ),
	/**
	 * @param data 
	 */
	fromlinformation: data => ajax( BASE + 'fromlinformation', data, 'POST' ),
	/**
	 * @param data 
	 */
	personalinformation: data => ajax( BASE + 'personalinformation', data, 'POST' ),
	/**
	 * @param data 
	 */
	checkMyMoneyRecord: data => ajax( BASE + 'checkMyMoneyRecord', data, 'POST' ),
	/**
	 * @param data 
	 */
	getMemberById: data => ajax( BASE + 'getMemberById', data, 'POST' ),
	
};


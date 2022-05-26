import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data
     */
	confirmorderlist: data => ajax( BASE + 'confirmorderlist', data, 'POST' ),
	/**
	 * @param
	 */
	sendconfirmorder: data => ajax( BASE + 'sendconfirmorder', data, 'POST' ),
	/**
	 * @param
	 */
	apppay: data => ajax( BASE + 'apppay', data, 'POST' ),
	/**
	 * @param
	 */
	publishquan: data => ajax( BASE + 'publishquan', data, 'POST' ),
	/**
	 * @param
	 */
	wofaqi: data => ajax( BASE + 'wofaqi', data, 'POST' ),
	/**
	 * @param
	 */
	wojieshou: data => ajax( BASE + 'wojieshou', data, 'POST' ),
	/**
	 * @param
	 */
	orderanniu: data => ajax( BASE + 'jieshou', data, 'POST' ),
	/**
	 * @param
	 */
	canceorder: data => ajax( BASE + 'canceorder', data, 'POST' ),
	/**
	 * @param
	 */
	changetime: data => ajax( BASE + 'changetime', data, 'POST' ),
	/**
	 * @param
	 */
	sendren: data => ajax( BASE + 'sendren', data, 'POST' ),
	/**
	 * @param
	 */
	sanorder: data => ajax( BASE + 'sanorder', data, 'POST' ),
	/**
	 * @param
	 */
	getStoreTime: data => ajax( BASE + 'getStoreTime', data, 'POST' ),
	/**
	 * @param
	 */
	orderOperation: data => ajax( BASE + 'orderOperation', data, 'POST' ),
};


import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data
     */
    messagelist: data => ajax( BASE + 'messagelist', data, 'POST' ),
	/**
	 * @param data
	 */
	jieshou: data => ajax( BASE + 'jieshou', data, 'POST' ),
};


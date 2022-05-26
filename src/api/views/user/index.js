
import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data
     */
    look: data => ajax( BASE + 'look', data, 'POST' ),
	/**
	 * @param data 
	 */
	report: data => ajax( BASE + 'report', data, 'POST' ),
	/**
	 * @param data 
	 */
	relevancemember: data => ajax( BASE + 'relevancemember', data, 'POST' ),
};


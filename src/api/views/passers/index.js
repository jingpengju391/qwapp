import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data 
     */
    lookme: data => ajax( BASE + 'lookme', data, 'POST' ),
	/**
	 * @param data
	 */
	recommendisomerism: data => ajax( BASE + 'recommendisomerism', data, 'POST' ),
};


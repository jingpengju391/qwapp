import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data
     */
    qinglvlist: data => ajax( BASE + 'qinglvlist', data, 'POST' ),
	/** 
	 * @param data
	 */
	freeblessing: data => ajax( BASE + 'freeblessing', data, 'POST' ),
	/**
	 * @param data
	 */
	publishquan: data => ajax( BASE + 'publishquan', data, 'POST' ),
	/**
	 * @param data
	 */
	payblessing: data => ajax( BASE + 'payblessing', data, 'POST' ),
	/**
	 * @param data
	 */
	payblessingOperation: data => ajax( BASE + 'payblessingOperation', data, 'POST' ),
};


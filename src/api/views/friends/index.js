import ajax from '../../ajax';

const 
BASE = '/index.php/index/index/';
export default {
    /**
     * @param data
     */
    invitationLists: data => ajax( BASE + 'invitationLists', data, 'POST' ),
	/**
	 * @param data
	 */
	invite: data => ajax( BASE + 'invite', data, 'POST' ),
};


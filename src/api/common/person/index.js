import ajax from '../../ajax';

const BASE = '/index.php/index/index/';

export default {
    /**
     * @param data
     */
    look: data => ajax( BASE + 'look', data, 'POST' ),
};

import ajax from '../../ajax';

const BASE = '/index.php/index/login/';

export default {
    /**
     * @param data
     */
    upload: data => ajax( BASE + 'upload', data, 'POST' ),
};

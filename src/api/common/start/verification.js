import ajax from '../../ajax';

const BASE = '/index.php/index/login/';

export default {
    /**
     * 验证码
     * @param data
     */
    send: data => ajax( BASE + 'send', data, 'POST' ),
};

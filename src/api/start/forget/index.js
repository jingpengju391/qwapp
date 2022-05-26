import ajax from '../../ajax';

const BASE = '/index.php/index/login/';

export default {
    /**
     * 忘记密码
     * @param data
     */
    wangji: data => ajax(BASE + 'wangji', data, 'POST'),
};


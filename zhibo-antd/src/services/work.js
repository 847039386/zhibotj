import CommonCRUD from './pubilc/commonCRUD';
import Conf from '../config';
import { errMsg } from '../utils/modal';
// 访问地址
const Api = 'api/work';

class WorkServices extends CommonCRUD {
    static Api = Api;
    static async qsid(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/qsid`, {
            method: 'POST',
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                if (cb) {
                    cb(data);
                }
            } else {
                if (cb) {
                    cb(null);
                }
                errMsg(data.msg);
            }
        })
    }

    static async addTask(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/ctask`, {
            method: 'POST',
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                if (cb) {
                    cb(data);
                }
            } else {
                if (cb) {
                    cb(null);
                }
                errMsg(data.msg);
            }
        })
    }

    // 清算
    static async ci(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/ci`, {
            method: 'POST',
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                if (cb) {
                    cb(data);
                }
            } else {
                if (cb) {
                    cb(null);
                }
                errMsg(data.msg);
            }
        })
    }

}

export default WorkServices
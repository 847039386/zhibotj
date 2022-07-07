import CommonCRUD from './pubilc/commonCRUD';
import fetchJsonp from 'fetch-jsonp';
import Conf from '../config';
import { errMsg } from '../utils/modal';

// 访问地址
const Api = 'api/settlein';

class SettleninServices extends CommonCRUD {
    static Api = Api;
    static async quid(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/quid`, {
            method: 'POST',
            body: JSON.stringify({ uid: params.uid })
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                cb(data);
            } else {
                cb(null);
                errMsg(data.msg);
            }

        })
    }

    static async qid(params, cb) {
        const _this = this;
        return fetchJsonp(`${Conf.host}/${_this.Api}/qid?id=${params.id}`).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                cb(data);
            } else {
                cb(null);
                errMsg(data.msg);
            }

        })
    }

    static async qw(params, cb) {
        const _this = this;
        return fetchJsonp(`${Conf.host}/${_this.Api}/qw?page=${params.page || 1}&size=${params.size || 10}`).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                cb(data);
            } else {
                cb(null);
                errMsg(data.msg);
            }

        })
    }

    static async excel(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/excel`, {
            method: 'POST',
            body: JSON.stringify(params)
        }).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                cb(data);
            } else {
                cb(null);
                errMsg(data.msg);
            }

        })
    }
}

export default SettleninServices
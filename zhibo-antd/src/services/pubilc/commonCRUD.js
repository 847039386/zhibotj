import fetchJsonp from 'fetch-jsonp';
import { errMsg } from '../../utils/modal';
// 访问地址
import Conf from '../../config';
class CommonCRUD {
    static Api;
    static async q(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/q`, {
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

    static async qs(callback) {
        const _this = this;
        return fetchJsonp(`${Conf.host}/${_this.Api}/qs`).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                if (callback) {
                    callback(data);
                }
            } else {
                if (callback) {
                    callback(null);
                }
                errMsg(data.msg);
            }

        })
    }

    static async qst(callback) {
        const _this = this;
        return fetchJsonp(`${Conf.host}/${_this.Api}/qst`).then((res) => {
            return res.json()
        }).then((data) => {
            if (data.success) {
                if (callback) {
                    callback(data);
                }

            } else {
                if (callback) {
                    callback(null);
                }
                errMsg(data.msg);
            }

        })
    }

    static async ct(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/ct`, {
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
    static async rm(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/rm`, {
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
    static async h(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/h`, {
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

    static async ut(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/ut`, {
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

    static async qid(params, cb) {
        const _this = this;
        return fetch(`${Conf.host}/${_this.Api}/qid`, {
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

export default CommonCRUD
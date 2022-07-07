import CommonCRUD from './pubilc/commonCRUD';
import fetchJsonp from 'fetch-jsonp';
import { errMsg } from '../utils/modal';
import Conf from '../config';
const Api = 'api/home';

class HomeServices extends CommonCRUD {
    static Api = Api;
    static async info(cb) {
        const _this = this;
        return fetchJsonp(`${Conf.host}/${_this.Api}/info`).then((res) => {
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

export default HomeServices
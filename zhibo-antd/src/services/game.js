import CommonCRUD from './pubilc/commonCRUD';
import fetchJsonp  from  'fetch-jsonp';
import { errMsg } from '../utils/modal';
import Conf from '../config';
const Api = 'api/game';

class GameServices extends CommonCRUD {
    static Api = Api;
}
  
export default GameServices
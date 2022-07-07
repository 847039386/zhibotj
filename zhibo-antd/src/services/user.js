import CommonCRUD from './pubilc/commonCRUD';
// 访问地址
const Api = 'api/user';

class UserServices extends CommonCRUD {
    static Api = Api;
}
  
export default UserServices
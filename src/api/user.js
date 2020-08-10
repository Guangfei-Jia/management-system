import axios from '@/utils/request';

//用户列表条件查询
export function getUserList(data){
    return axios.post('/user/list', data);
}

//修改用户
export function updateUser(data){
    return axios.put('/user/update', data);
}

//删除用户
export function deleteUser(id){
    return axios.delete('/user/delete/' + id);
}

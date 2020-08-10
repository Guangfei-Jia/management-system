import axios from '@/utils/request';

//角色列表条件查询
export function getRoleList(data){
    return axios.post('/role/list', data);
}

//新增角色
export function addRole(data){
    return axios.post('/role/add', data);
}

//修改角色
export function updateRole(data){
    return axios.put('/role/update', data);
}

//删除角色
export function deleteRole(id){
    return axios.delete('/role/delete/' + id);
}

//角色授权菜单
export function setRole(data){
    return axios.post('/limit/menu/add', data);
}

//查询账号已拥有的角色列表
export function getUserRole(id){
    return axios.get('/limit/role/list/' + id);
}

//用户授权角色
export function setUserRole(data){
    return axios.post('/limit/role/add', data);
}

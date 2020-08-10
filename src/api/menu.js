import axios from '@/utils/request';

//菜单列表条件查询
export function getMenuList(){
    return axios.get('/menu/list');
}

//新增菜单
export function addMenu(data){
    return axios.post('/menu/add', data);
}

//修改菜单
export function updateMenu(data){
    return axios.put('/menu/update', data);
}

//删除菜单
export function deleteMenu(id){
    return axios.delete('/menu/delete/' + id);
}

//获取角色对应的菜单
export function getRoleMenu(id){
    return axios.get('/limit/menu/list/' + id);
}
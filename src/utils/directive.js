import Vue from 'vue';

//异步检测图片url是否有效
Vue.directive('real-img', async (el, binding) => {
    let imgUrl = binding.value;
    if(imgUrl) {
        let effect = await imgExist(imgUrl);
        if(effect){
            el.setAttribute('src', imgUrl);
        }
    }
})
//判断当前图片url是否有效
let imgExist = function(url) {
    return new Promise( resolve => {
        let img = new Image();
        img.onload = function(){
            if(this.complete == true){
                console.log("资源加载");
                resolve(true);
                img = null; //释放img占用空间
            }
        }
        img.onerror = function(){
            console.log(`资源错误：${img}`);
            resolve(false);
            img = null;
        }
        img.src = url;
    })
}

//完整的自定义组件示例
Vue.directive('test', {
    //只调用一次，指令第一次绑定到元素时调用
    bind: function(el, binding, vnode, oldvnode){
        console.log(`当前元素：${el}`)
        console.log(`虚拟节点：${vnode}`)
        console.log(`上一个虚拟节点：${oldvnode}`)
        console.log(`不包含前缀的指令名：${binding.name}`)
        console.log(`指令绑定的值：${binding.value}`)
        console.log(`指令绑定的表达式：${binding.expression}`)
        console.log(`指令:绑定的参数：${binding.arg}`)
        console.log(`指令修饰符对象：${binding.modifiers}`)
    },
    //被绑定元素插入父节点时调用，父节点存在，不一定已经插入完成
    inserted: function(el, binding, vnode, oldvnode){},
    //所在vnode更新时调用，可能发生在子vnode更新之前
    update: function(el, binding, vnode, oldvnode){},
    //指令所在组件及其子组件全部更新后调用
    componentUpdated: function(el, binding, vnode, oldvnode){},
    //指令与元素解绑
    unbind:  function(el, binding, vnode, oldvnode){},
})
//只关心bind和update的简写版
// Vue.directive('simple', (el, binding) => {});
/*
 * @Author: jiaguangfei 
 * @Date: 2020-07-13 11:01:22 
 * @Last Modified by: jiaguangfei
 * @Last Modified time: 2020-07-13 11:02:55
 */
import Vue from 'vue';

/**
 * 数值格式转换，每3位逗号分割，默认保留两位小数
 * @param value 数值
 * @param num 精度
 */
Vue.filter('NumberFormat', function(value, num = 2){
    if(!value){
        return '0'
    }
    let index = value.toString().indexOf ('.');
    let numberFormat = index !== -1 
                        ? value.toString().slice(0, index).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '' + value.toString().slice(index, index + num + 1)
                        : value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
    return numberFormat;
})
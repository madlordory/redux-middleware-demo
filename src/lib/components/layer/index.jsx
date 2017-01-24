import React from 'react';

import styles from './index.less';

/**
 * @description: 浮层组件（显示时会置html标签overflow:hidden保证不会出现穿透滚动的情况）
 * @param: {booleam} isShow 显示隐藏的控制变量,隐藏时请显示传递该参数,否则页面将不能滚动
 */
export default class Layer extends React.Component {
    constructor (props) {
        super(props);

        /*
         * 响应式布局
         * */

        /*
         * 初始化state
         * */
        this.state = {};

        //是否已经向html节点添加了禁止滚动的class
        this.hasAdd = false;
    }

    componentDidMount () {

    }

    render() {
        let className = 'layer hide',
            html = document.getElementsByTagName('html');
        
        html = html && html[0];

        if(this.props.isShow){
            className = 'layer';
            if(!html.className){
                html.className = 'forbidden-scroll';
            }else{
                if(html.className.indexOf('forbidden-scroll') == -1){
                    html.className += ' forbidden-scroll';    
                }
            }
            this.hasAdd = true;
        }else{
            if(this.hasAdd){
                this.hasAdd = false;
                html.className = html.className.replace('forbidden-scroll', '');
            }
        }

        return (
            <div className={className}></div>
        );
    }
}


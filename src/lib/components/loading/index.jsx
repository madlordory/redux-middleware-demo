
import React from 'react';

import styles from './index.less';

import Layer from '../layer/';

//动画的触发事件
const TIME_OUT = 300;

/**
* @description: loading组件
* @param: {isShow} boolean 是否显示
* @param: {mask=false} boolean 是否显示mask
* @param: {cont=’加载中'} string 加载中描述 
*/
export default class Loading extends React.Component {
    constructor (props) {
        super(props);

        /*
         * 响应式布局
         * */

        /*
         * 初始化state
         * */
        this.state = {
            hasShow: false
        };

        this.animationInClass = 'ani-upin';
        this.animationOutClass = 'ani-upout';
        this.originClass = 'loading';
        this.className = '';
    }
    animationEndHandler(){
        if(this.props.isShow != this.state.hasShow){
            this.setState({
                hasShow: this.props.isShow
            })
        }
    }
    componentDidMount() {
        this.validateProps(this.props);
    }
    validateProps(nextProps) {
        if(nextProps.isShow != this.state.hasShow){
            if(nextProps.isShow){
                this.className = this.originClass + ' ' + this.animationInClass;
                this.setState({
                    hasShow: nextProps.isShow
                })
            }else{
                this.className = this.originClass + ' ' + this.animationOutClass;
            }
        }
    }
    componentWillReceiveProps(nextProps){
        //同步组件状态
        this.validateProps(nextProps);
        //如果animationend不能触发的话需要写一个timeout
        // setTimeout(()=>{
        //     if(this.props.isShow != this.state.hasShow){
        //         this.setState({
        //             hasShow: this.props.isShow
        //         })
        //     }
        // }, TIME_OUT)
    }
    render() {
        let className = '';
        if(this.props.isShow == this.state.hasShow && !this.state.hasShow){
            className = 'hide';
        }

        return (
            <div className={className}>
                <Layer isShow={this.props.mask && this.state.hasShow} />
                <div onAnimationEnd={this.animationEndHandler.bind(this)} className={this.className}>
                    <span className='loading-icon ani-rotate'>
                        <i className='loading-icon-halfcircle loading-icon-halfcircle-t'></i>
                        <i className='loading-icon-halfcircle loading-icon-halfcircle-b'></i>
                    </span>
                    <p className='loading-cont'>{this.props.cont || '加载中...'}</p>
                </div>
            </div>
        );
    }
}


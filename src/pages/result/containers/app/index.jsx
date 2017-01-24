/**
 * Created by madlord on 16/5/4.
 */
import './assets/styles/global.less';//以*.less为后缀的样式文件将以全局作用域模式载入到DOM中
import React from 'react';
import RLU from 'rlu';//response layout util
import * as Action from '../../actions';
import styles from './assets/styles/index.less.module';//css module
import { connect } from 'react-redux'
import Loading from '@lib/components/loading/';
import TuanList,{moduleName} from '../../modules/tuan-list/index'
/*
* 不强制登录
* 如果登录则显示（好友+机器人）的抽签结果
* 如果不登录则显示 所有机器人的抽签结果
*
* */
@connect((state) => {
    return {
    loading:state[moduleName].loading,
    //...state
}})
export default class Index extends React.Component {
    constructor (props) {
        super(props);


        /*
         * 响应式布局
         * */
        RLU.init(375);//375 or 320 视觉搞基准宽度

    }

    static propTypes = {
        // onMaskTap:React.PropTypes.func
    }

    static defaultProps = {
    }

    /*
    * 默认state
    * */
    state={

    }

    onClick=(e)=>{
        // this.props.queryInitData();
        console.log("tap");
    }

    componentDidMount () {

    }

    render() {
        // console.log(this.props.loading);
        return (
            <div>
                <div className={styles.tv}>
                    DPTV
                </div>
                <div className={styles.buttonBar}>
                    <button onTouchTap={this.onClick} disabled={this.props.loading}>按钮</button>
                    <div>
                        {this.props.lucky_info}
                    </div>
                    <div>
                        {this.state.test}
                    </div>
                </div>
                <div className={styles.luckyList}>
                    好友集好运列表
                </div>
                <TuanList className={styles.tuanList}>
                </TuanList>
                <Loading isShow={this.props.loading} mask={true} />
            </div>
        );
    }
}



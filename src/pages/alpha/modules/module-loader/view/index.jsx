/**
 * Created by madlord on 2017/1/10.
 */
"use strict"

import React ,{Component, PropTypes} from 'react';
import Loading from '@lib/components/loading/';

export default class App extends React.Component {
    constructor (props) {
        super(props);
        this.props.init();
    }

    static propTypes = {
        init:PropTypes.func.isRequired,
        module:PropTypes.func.isRequired,
    }

    static defaultProps = {
        loading:false
    }

    /*
     * 默认state
     * */
    state={

    }




    componentDidMount () {

    }

    render() {
        // console.log(this.props.loading);
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

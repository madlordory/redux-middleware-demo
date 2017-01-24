/**
 * Created by madlord on 2017/1/10.
 */
"use strict"

import React ,{Component, PropTypes} from 'react';
export default class TuanList extends React.Component {
    constructor (props) {
        super(props);
    }

    static propTypes = {
        // onMaskTap:React.PropTypes.func
        viewDidMount:PropTypes.func.isRequired,
        submit:PropTypes.func.isRequired,
    }

    static defaultProps = {

    }

    /*
     * 默认state
     * */
    state={

    }

    submit=(e)=> {
        this.props.submit(30);
    }



    componentDidMount () {
        console.log("shoplist didmount");

        this.props.viewDidMount();

    }

    render() {
        // console.log(this.props.loading);
        return (
            <div onClick={this.submit}>
                {'test'+this.props.result||0}
            </div>
        );
    }
}

/**
 * Created by madlord on 2017/1/10.
 */
"use strict"
import TuanList from './view/tuan-list';
import {connect} from 'react-redux';
import React ,{Component, PropTypes} from 'react';
import __map from "lodash/map";

import ducker,{SyncActionType,AsyncActionType} from 'ducker';


const initialState = {
    result: 0,
    loading: false
}

export const TYPES = {
    "APP_INIT": new SyncActionType("APP_INIT"),
    "VIEW_DID_MOUNT": new SyncActionType("VIEW_DID_MOUNT"),
    "VIEW_WILL_UNMOUNT": new SyncActionType("VIEW_WILL_UNMOUNT"),
    "SUBMIT": new AsyncActionType("SUBMIT"),
}

export const {moduleName,actions, middleware, reducer}=ducker("TuanListModule",initialState,[
        {
            type: TYPES.APP_INIT,
            watcher: (getState, dispatch, action) => {

            },
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    a: action && action.a
                }
            }
        },
        {
            type: TYPES.SUBMIT,
            watcher: (getState, dispatch, action) => {
                let data = action.payload;
                setTimeout(() => {
                    dispatch(TYPES.SUBMIT.SUCCESS.createAction(data))
                }, 2000)
            },
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: true
                }
            }
        },
        {
            type: TYPES.SUBMIT.SUCCESS,
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    result: action && action.payload,
                }
            }
        },
        {
            type: TYPES.SUBMIT.STOP,
            reducer: (state = initialState, action) => {
                return {
                    ...state,
                    loading: false
                }
            }
        },
    ]
);

class ABC {

}

const ModuleConnect=(Module,mapStateToProps,mapDispatchToProps,mergeProps,...rest)=>(Comp)=>{
    const ModuleName=Module.name;
    const UUID_KEY="uuid";
    class _Comp extends Component {
        constructor(props) {
            super(props)
            this.prepareConnectedComp(props);
        }

        static propTypes = {
            [UUID_KEY]:React.PropTypes.String
        }

        static defaultProps = {
            [UUID_KEY]:""
        }

        componentWillReceiveProps(nextProps) {
            this.prepareConnectedComp(nextProps);
        }

        prepareConnectedComp (nextProps) {
            let oldOne=this.props&&this.props[UUID_KEY]||Comp.defaultProps[UUID_KEY];
            let newOne=nextProps&&nextProps[UUID_KEY]||Comp.defaultProps[UUID_KEY];
            const ModuleInstanceName=ModuleName+(newOne&&("@"+newOne)||"");
            if ((!this.ConnectedComp)||(oldOne!=newOne)) {
                let _mapStateToProps=mapStateToProps&&((state,ownProps)=>{
                        let localState=state[ModuleInstanceName];
                        return mapStateToProps(state,localState,ownProps)
                    })||undefined;
                let _mergeProps=((stateProps, dispatchProps, ownProps)=>{
                        let _dispatchProps={};
                        dispatchProps&&__map(dispatchProps,(v,k)=>{
                            _dispatchProps[k]=(...rest)=>(v(ModuleInstanceName,...rest));
                        });
                        return mergeProps&&mergeProps(stateProps, _dispatchProps, ownProps)||Object.assign({}, ownProps, stateProps, _dispatchProps);
                    })||undefined;
                this.ConnectedComp=connect(_mapStateToProps,mapDispatchToProps,_mergeProps,...rest)(Comp);
            }
        }
        render () {
            let ConnectedComp=this.ConnectedComp;
            return ConnectedComp?<ConnectedComp {...this.props}/>:null;
        }
    }

    return _Comp;

}

export default ModuleConnect(ABC,(state) => {
    state=state[moduleName];
    return {
        result: state.result,
        loading: state.loading,
        //...state
    }
}, {
    viewDidMount: TYPES.VIEW_DID_MOUNT.createAction,
    submit: TYPES.SUBMIT.createAction
})(TuanList);
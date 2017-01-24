/**
 * Created by madlord on 2017/1/20.
 */
"use strict";
import React,{Component} from 'react';
const mo_a=new Promise((resolve,reject)=>{
    require.ensure(()=>{
        resolve(require("xxx"));
    });
})


class Mo_a extends Component {

}
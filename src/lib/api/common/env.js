/**
 * Created by madlord on 2016/12/15.
 */
"use strict"
// import Promise from 'promise';
import DPApp from "@dp/dpapp";
import queryString from 'query-string';
import cacheHelper from './cache-helper'


const KEYS={
    TOKEN:'TOKEN',
    PLATFORM:'PLATFORM',
    QUERY:'QUERY'
};

const PLATFORM={
    DPAPP:'DPAPP',
    WEIXIN:'WEIXIN',
    OTHER:'OTHER'
}



const getPlatform=()=>{
    return cacheHelper(KEYS.PLATFORM,()=>{
        const isApp = /dp\/com\.dianping/.test(navigator.userAgent), isWeixin = /MicroMessenger/i.test(navigator.userAgent);
        const platform = isApp && PLATFORM.DPAPP || (isWeixin && PLATFORM.WEIXIN) || PLATFORM.OTHER;
        return Promise.resolve(platform);
    });

}
const getToken=()=>{
    return cacheHelper(KEYS.TOKEN,()=>{
        return new Promise((resolve,reject)=>{
            getPlatform().then(platform=>{
                if (platform==PLATFORM.DPAPP) {
                    DPApp.getUserInfo().then((userInfo)=> {
                        resolve(userInfo&&userInfo.token||"");
                    }, reject)
                } else {
                    resolve('');
                }
            },reject)

        });
    });
};

const getQuery=()=>{
    return cacheHelper(KEYS.QUERY,()=>{
        const query = queryString.parse(location.search);
        return Promise.resolve(query);
    });

}
export default {
    getToken,
    getPlatform,
    getQuery
}
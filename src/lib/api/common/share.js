/**
 * Created by madlord on 2016/12/15.
 */
"use strict";
const defaultPreset={
    conf:{
        title: '30万份霸王餐免费抢！',
        desc: '【大众点评送福利】',
        url: 'http://m.dianping.com/mobile/event/list?source=mShare',
        image: 'http://j1.s2.dpfile.com/s/i/app/activity/share1127.png',
        content: '30万份霸王餐免费抢',
        // channelDPApp: [Share.CHANNEL.WECHAT_FRIENDS, Share.CHANNEL.WECHAT_TIMELINE],
        // channelWX: [Share.CHANNEL.WECHAT_FRIENDS, Share.CHANNEL.WECHAT_TIMELINE],
        // channelBrowser: [Share.CHANNEL.WEIBO, Share.CHANNEL.WEIBO_TECENT],
        // channelQQ: [Share.CHANNEL.WECHAT_FRIENDS],
        handle: function () {
            //右上角被点击了
        },

        success: function () {
            console.log('share success');
        },
        fail: function () {
            console.log('share failed');
        },
        cancel: function () {
            console.log('share canceled');
        }
    },
    setting:{
        hide: false
    }
};
let lastConfig={};
let _ins;
export default class SHARE {
    static getIns() {
        return _ins;
    };
    static config (config) {
        let {conf,setting}=config;
        if (!_ins) {
            require.ensure([],(require)=>{//异步加载
                var Share = require('@dp/util-m-share');
                _ins = new Share(Object.assign({},defaultPreset.conf,lastConfig.conf,conf),Object.assign({},defaultPreset.setting,lastConfig.setting,setting));
            });
        } else {
            _ins.updateConfig(Object.assign({},defaultPreset.conf,lastConfig.conf,conf));
        }
        lastConfig=config;
    };
}

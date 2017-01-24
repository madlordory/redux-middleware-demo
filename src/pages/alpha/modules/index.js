/**
 * Created by madlord on 2017/1/17.
 */
"use strict";
import ShopListCreator from './shop-list/index';
import ShoeLis from './shoe-list/index';
import CardListCreator from './card-list/index';
import AppModule from './app/index';
import {registerModules} from 'ducker';


export const App=new AppModule();
export const ShopList=ShopListCreator("ShopList");
export const ShoeList=new ShoeLis("ShoeList");
registerModules({
    App,
    ShoeList
});
//
// setTimeout(()=>{
//     require.ensure([],()=>{
//         const CardListCreator =require('./card-list/index').default;
//         const CardList=CardListCreator("CardList");
//         registerModules({
//             CardList
//         })
//     });
//
// },5000)
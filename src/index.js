import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './env.js'
import App from './App';
import { AlitaProvider } from 'redux-alita';
import { registerMicroApps, start } from 'qiankun';
import {checkUserInfo, initSystem} from "./run/runMicroApps";

let __userInfo = null;
let __userMenus = [];
let __firstMenus = {}
function render({ appContent, loading }) {
    ReactDOM.render(
        <AlitaProvider>
            <App loading={loading} content={appContent} firstMenus={__firstMenus} userInfo={__userInfo} userMenus={__userMenus} />
        </AlitaProvider>,
        document.getElementById('appRoot')
    );
}
function genActiveRule(routerPrefix) {
    return location => location.pathname.startsWith(routerPrefix);
}

const request = url =>  {
    return fetch(url, {referrerPolicy: 'origin-when-cross-origin'})};

initSystem();
checkUserInfo().then(res => {
    const {userInfo, appWebList, menus, firstMenus } = res;
    const newAppMicroApps = appWebList.map((item) => {
        return {
            name: item.name, entry: item.entry, render, activeRule: genActiveRule('/' + item.name)
        }
    })
    __userInfo = userInfo;
    __userMenus = menus;
    __firstMenus = firstMenus
    render({ loading: true });
    registerMicroApps(newAppMicroApps, {
        beforeLoad: [
            app => {
                window.console.log('before load', app);
                window._globalEvent.trigger('microAppsLoadStatusChange', true);
            },
        ],
        beforeMount: [
            app => {
                window.console.log('before mount', app);
                window._globalEvent.trigger('microAppsLoadStatusChange', false);
            },
        ],
        afterUnmount: [
            app => {
                window.console.log('after unload', app);
            },
        ],
    });
    start({ prefetch: true, fetch: request });
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

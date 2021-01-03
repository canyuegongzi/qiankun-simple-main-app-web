import './App.css';
import React, {useEffect, useCallback, useState} from "react";
import RouterComponent from "./route";
import {usePerrsonSetting} from "./scripts/customHooks";

function App(props) {
    const [appLoading, setLoading] = React.useState('dark');
    const {theme, navModal, setConfig} = usePerrsonSetting();

    /**
     * 系统加载状态修改
     * @type {Function|*}
     */
    const microAppsLoadStatusChange = useCallback((data = true) => {
        setLoading(data);
    }, []);

    /**
     * 保存个人配置
     * @type {Function|*}
     */
    const savePersonConfig = useCallback((data) => {
        setConfig(data);
    }, [setConfig]);
    useEffect(() => {
        window._globalEvent.listen('microAppsLoadStatusChange', microAppsLoadStatusChange);
        window._globalEvent.listen('personConfigChange', savePersonConfig);
        return () => {
            window._globalEvent.remove('microAppsLoadStatusChange', microAppsLoadStatusChange);
            window._globalEvent.remove('personConfigChange', savePersonConfig);
        }
    }, []);
    return (
        <RouterComponent {...props} theme={theme} navModal={navModal} firstMenus={props.firstMenus} appLoading={appLoading} userMenus={props.userMenus} />
    );
}

export default App;

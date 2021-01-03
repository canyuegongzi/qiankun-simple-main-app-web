import { useRef, useState, useCallback } from 'react';

/**
 * 上一状态
 * @type
 */
export const usePrevious = (function (state, compare) {
    const prevRef = useRef();
    const curRef = useRef();
    const needUpdate = typeof compare === 'function' ? compare(curRef.current, state) : true;

    if (needUpdate) {
        prevRef.current = curRef.current;
        curRef.current = state;
    }

    return prevRef.current;
});

/**
 * 布尔开关
 * @param init
 */
export function useSwitch(init) {
    const [switcher, setSwitcher] = useState(init);
    const turnOn = () => setSwitcher(true);
    const turnOff = () => setSwitcher(false);
    return [switcher, { turnOn, turnOff, setSwitcher }];
}

/**
 * 加载个人配置
 * @returns {null}
 */
export const loadPersonConfig = () => {
    const storeConfig = window.localStorage.getItem('personConfig');
    return storeConfig ? JSON.parse(storeConfig) : null;
}
/**
 * 个人配置
 */
export function usePerrsonSetting() {
    const [theme, setTheme] = useState(loadPersonConfig() ? loadPersonConfig().theme : 'dark');
    const [navModal, setNavModal] = useState(loadPersonConfig() ? loadPersonConfig().navModal : 'vertical');

    /**
     * 加载个人配置
     * @returns {null}
     */
    const loadConfig = () => {
        const storeConfig = window.localStorage.getItem('personConfig');
        return storeConfig ? JSON.parse(storeConfig) : null;
    }

    /**
     * 保存配置
     * @type {Function|*}
     */
    const setConfig = useCallback((data = {theme: 'dark', navModal: 'vertical'}) => {
        setNavModal(data.navModal);
        setTheme(data.theme);
        const newConfig = loadConfig() ? {...loadConfig(), theme: data.theme, navModal: data.navModal }: {theme: data.theme, navModal: data.navModal};
        window.localStorage.setItem('personConfig', JSON.stringify(newConfig));
    }, [theme, navModal]);

    return {
        setConfig, theme, navModal, loadConfig
    }
}

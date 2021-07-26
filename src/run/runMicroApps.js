/**
 * 初始化系统的信息
 * @returns {Promise<any>}
 */
import {MimeStorage} from "../scripts/localStorage";
import {$get, $post} from "../http/feth";
import {userCenterApi} from "../http/apiUrl";
import {PubEvent} from "../scripts/globalEvent";
import {getParent, getQueryString, treeFind} from "../scripts/utils";

/**
 * 非法用户回调
 */
export const illegalityUserCallback = () => {
    const casBaseURL = /^(http:\/\/|https:\/\/)/.test(window.APPROOTENV.casDomain) ?
        window.APPROOTENV.casDomain :
        window.APPROOTENV + window.APPROOTENV.casDomain;
    window.location.href = casBaseURL + '?redirectUrl=' + window.location.href;
}

/**
 * 校验用户登录信息
 * @returns {Promise<any>}
 */
export const checkUserInfo = () => {
    return new Promise(async(resolve) => {
        const mimeStorage = new MimeStorage();
        let sessionStorageToken = mimeStorage.getItem('token') || sessionStorage.getItem('token');
        if (sessionStorageToken === "null" || !sessionStorageToken) {
            illegalityUserCallback();
            return;
        }
        const userInfo = await initUserLogin(sessionStorageToken);
        if (userInfo && userInfo.data && userInfo.success) {
            const appWebList = await getMicroApps();
            const menus = await getUserMenusList(userInfo.data.name, userInfo.data.role.id);
            console.log(menus)
            let firstMenus = {}
            if (window.location.hash && window.location.pathname) {
                firstMenus = getFirstmenusByUrl(menus);
            }else {
                firstMenus = getFirstMenus(menus);
            }
            if (firstMenus && firstMenus.firstKey) {
                window.history.pushState({}, '聚合管理系统', firstMenus.firstKey);
            }
            resolve({success: userInfo.success, userInfo: userInfo.data, appWebList: appWebList, menus, firstMenus })
            return;
        }
        illegalityUserCallback();
    })
}

/**
 * 初始化用户信息
 * @returns {Promise<any>}
 */
export const initUserLogin = (token) => {
    return new Promise(async (resolve) => {
        const userInfo = await $post(userCenterApi.getUerInfoByToken.url, {token: token}, userCenterApi.getUerInfoByToken.server)
        resolve(userInfo);
    })
}

/**
 * 获取微服务列表
 * @returns {Promise<void>}
 */
export const getMicroApps = async () => {
    return new Promise(async (resolve) => {
        const res = await $get(userCenterApi.systemList.url, {page: 1, pageSize: 20}, userCenterApi.systemList.server);
        let systemList = [];
        const resultList = [];
        if (res && res.data && res.data.data) {
            systemList = res.data.data;
        }
        for (let i = 0; i < systemList.length; i ++) {
            const value = systemList[i].attrValue.split('::');
            if (value.length > 2 && value[2] === true + '') {
                resultList.push({
                    name: value[0], entry: value[1]
                })
            }
        }
        resolve(resultList);
    })
}

/**
 * 系统初始化
 */
export const initSystem = () => {
    const _globalEvent = new PubEvent();
    window._globalEvent = _globalEvent;
    if (getQueryString('token')) {
        const mimeStorage = new MimeStorage();
        mimeStorage.setItem({name: 'token', value: getQueryString('token'), expires: 120 * 60 * 1000 })
        try {
            const url = window.location.origin + window.location.pathname + window.location.hash.split('?token=')[0];
            window.location.href = url;
        }catch (e) {
            const url = window.location.origin + window.location.pathname;
            window.location.href = url;
        }
    }
    return { _globalEvent };

}

/**
 * 获取用户资源
 */
export const getUserMenusList = (userName, roleId, system = "micro-apps-web") => {
    return new Promise(async (resolve) => {
        const res = await $get(userCenterApi.userAuthority.url, { user: userName, roleId: roleId, system}, userCenterApi.userAuthority.server);
        dealMenus(res.data);
        resolve(res && res.data ? res.data : [] )
    })
}

/**
 * 处理菜单资源
 * @param lise
 */
export const dealMenus = (list = []) => {
     list.forEach((item) => {
         if(item.path && item.name) {
             item.key = item.path;
             item.title = item.name;
             if (!item.value) {
                 item.isIframe = false;
             }
         }
         if (item.children) {
             dealMenus(item.children)
         }
     })
}

/**
 * 获取默认第一个菜单
 * @param list
 */
export const getFirstMenus = (list) => {
    if (list.length === 0) {
        return null;
    }
    let firstMenus = null;
    const getFirst = (arr) => {
        if (firstMenus) {
            return firstMenus;
        }
        for (let i = 0; i < arr.length; i ++) {
            if (arr[i].key.indexOf('#') > -1) {
                firstMenus = arr[i];
                return firstMenus;
            }
            if (Array.isArray(arr[i].children) && arr[i].children.length > 0) {
                getFirst(arr[i].children)
            }
        }
    }
    getFirst(list);
    if (firstMenus) {
        const parentNode = getParent(list, firstMenus.id);
        const openKeys = parentNode.map((item) => {
            return item.key;
        });
        return {
            firstKey: firstMenus.key,
            openKeys: openKeys
        }
    }
    return {
        firstKey: '',
        openKeys: []
    }

}

/**
 * 获取第一个菜单通过url
 * @param list
 */
export const getFirstmenusByUrl = (menus) => {
    if (menus.length === 0) {
        return null;
    }
    let openKeys = [];
    const tempData = treeFind(menus, (node) => {
        return node.key === window.location.pathname + window.location.hash
    });
    if (tempData) {
        const parentNode = getParent(menus, tempData.id);
        openKeys = parentNode.map((item) => {
            return item.key;
        });
    }
    return {
        firstKey: tempData.key,
        openKeys:openKeys
    }
}

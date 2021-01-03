### 概述
主系统采用乾坤集成react技术栈，子系统技术栈不限，docker部署;
[乾坤](https://qiankun.umijs.org/)
### 预览
### 技术栈： 
* 主系统：React + Antd + qiankun
* 子系统：Vue
### 演示地址
[演示地址](http://148.70.150.131:10010)
[github](https://github.com/canyuegongzi/qiankun-simple-main-app-web)
### 系统截图
![rootwebapp1.png](http://qiniu.canyuegongzi.xyz/rootwebapp1.png)
![rootwebapp1.png](http://qiniu.canyuegongzi.xyz/rootwebapp2.png)
![rootwebapp1.png](http://qiniu.canyuegongzi.xyz/rootwebapp3.png)
### 主系统设计
#### 框架搭建
1. 系统基础搭建
```
// 脚手架创建基础代码
npx create-react-app simple-main-app-web
// 暴露配置(能更好的优化webpack打包)
npm run eject
```
2. qiankun常用api
a. registerMicroApps服务注册
[registerMicroApps](https://qiankun.umijs.org/api#registermicroappsapps-lifecycles)
```
const app1 = [
    {
        name: 'app1',                 // 微服务名：需要和子系统中package.json中的name保持一致
        entry: '//localhost:8080',    // 微服务系统地址：子系统入口地址(注意：采坑点)
        container: '#container',      // 子系统需要挂载的节点
        activeRule: '/react',         // 子系统的触发规则可以自定义函数(见genActiveRule)
    }
]
function genActiveRule(routerPrefix) {
    return location => location.pathname.startsWith(routerPrefix);
}
registerMicroApps(app1, {
        beforeLoad: [
            app => {},
        ],
        beforeMount: [
            app => {},
        ],
        afterUnmount: [
            app => {},
        ],
    });
```
b. start主应用启动
[start](https://qiankun.umijs.org/api#registermicroappsapps-lifecycles)
```
// 自定义请求方式
const request = url =>  {return fetch(url, {referrerPolicy: 'origin-when-cross-origin'})};
start({ prefetch: true, fetch: request });
```
c. setDefaultMountApp设置默认应用
[setDefaultMountApp](https://qiankun.umijs.org/api#registermicroappsapps-lifecycles)
```
setDefaultMountApp()
```
d. runAfterFirstMounted
第一个微应用 mount 后需要调用的方法，比如开启一些监控或者埋点脚本。
[runAfterFirstMounted](https://qiankun.umijs.org/api#registermicroappsapps-lifecycles)
```
runAfterFirstMounted(() => doSoming());
```
#### 用户权限
用户鉴权实现
```
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
            systemList = res.data.data.data;
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
        if (userInfo && userInfo.data && userInfo.data.success) {
            const appWebList = await getMicroApps();
            const menus = await getUserMenusList(userInfo.data.data.name, userInfo.data.data.role.id);
            let firstMenus = {}
            if (window.location.hash && window.location.pathname) {
                firstMenus = getFirstmenusByUrl(menus);
            }else {
                firstMenus = getFirstMenus(menus);
            }
            if (firstMenus && firstMenus.firstKey) {
                window.history.pushState({}, '聚合管理系统', firstMenus.firstKey);
            }
            resolve({success: userInfo.data.success, userInfo: userInfo.data.data, appWebList: appWebList, menus, firstMenus })
            return;
        }
        illegalityUserCallback();
    })
}
```
#### 自定义hooks
1. 个人配置hooks
主要用户存储用户的个性化的配置信息
```
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
```
2. 上一状态hooks
```
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
```
### 子系统设计
#### 生命周期改造
1. webpack配置修改
a. publicPath保持绝对路径或者 './'
```
publicPath: './', || 'http://canyuegongzi.xyz/simple-user-center-web/'
```
b. output打包格式修改
打包输出文件修改为umd， 方便主应用采用fetch拉取代码
```
output: {
            library: '[name]',
            filename: '[name].js',
            libraryTarget: 'umd',
        },
```
c. 生命周期暴露
主应用需要识别子系统暴露的生命周期函数
```
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log("VueMicroApp bootstraped");
}

/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props: any) {
  console.log("VueMicroApp mount", props);
  render(props);
}

/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount() {
  console.log("VueMicroApp unmount");
  instance.$destroy();
  instance = null;
  router = null;
}

```
d. 子应用保持活性
子应用需要通过判断是否是微服务聚合系统中，来创建不同性质的Vue实例(子系需要能单独访问也能在聚合系统中访问)
```
if (window.__POWERED_BY_QIANKUN__) {
  // 动态设置 webpack publicPath，防止资源加载出错
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
}

```
##### example
```
let router: any = null;
let instance: any = null;

function render({ data = {} , container } = {}) {
  console.log(container)
  instance = new Vue({
    router: getRouter(allMenus),
    store,
    render: h => h(App),
  }).$mount("#app");
}
if (!window.__POWERED_BY_QIANKUN__) {
  escapeCheckSession$().then((router: any) => {
    instance = new Vue({
      router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  });
}
```
### 部署
为最大限度的保持系统稳定性(刷新问题，微应用触发)，系统部署是主应用采用history路由格式，子应用（通常部署在二级目录下）采用hash路由
#### 子应用部署
![rootwebapp4.png](http://qiniu.canyuegongzi.xyz/rootwebapp4.png)
#### 主应用部署
主应用采用history路由，为保证刷新不存在问题部署在nginx一级目录下(也可以通过nginx的重定向配置解决);
1. Dockerfile
```
FROM nginx:latest
MAINTAINER canyuegongzi
EXPOSE 10010
COPY micro-apps-web/  /usr/local/nginx/dist/
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo 'build image success!!'
```
2. nginx.conf
```
worker_processes auto;
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    client_max_body_size   20m;
    server {
        listen       10010;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;
     location / {
        root   /usr/local/nginx/dist;
        index  index.html index.htm;
        try_files $uri $uri/ /index.html;
        }

        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }

    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}

```
#### 容器化
```
docker build -t microapp:latest .
```
#### 容器启动
```
ocker run -d -it --restart=on-failure:3 --name microapp -p 10010:10010 244341b5bc37
```
### 采坑点
#### 主系统接入子系统
子系统接入系统入口必须为目录（针对子系统部署在二级目录的情况）
![rootwebapp5.png](http://qiniu.canyuegongzi.xyz/rootwebapp5.png)
#### 子系统部署
子应用部署和普通工程相同(最好采用hash路由格式)
#### 主系统部署
主应用部署最好部署在一级目录下(多级目录下需要自定义子应用注册的activeRule函数特殊处理)


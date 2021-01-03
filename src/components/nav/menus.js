/**
 * 導航
 * @type {{menus: *[], others: Array}}
 */
const menus = {
    menus: [
        {
            key: '/app/ui',
            title: 'UI',
            icon: 'scan',
            children: [
                { key: '/userManage/userList', title: '用户管理', isIframe: false, component: 'Gallery', system: 'simple-user-center-web' },
                { key: '/roleManage/roleList', title: '角色管理', isIframe: false, component: 'MapUi', system: 'simple-user-center-web' },
            ],
        }
    ],
    others: [], // 非菜单相关路由
};

export default menus;

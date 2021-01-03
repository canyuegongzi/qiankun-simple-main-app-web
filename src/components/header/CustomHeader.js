import React, { useState, useEffect, useCallback } from 'react';
import {Layout, Avatar, Image, Menu} from 'antd';
import {DesktopOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import {MimeStorage} from "../../scripts/localStorage";
import CustomHorizontalSlider from "../nav/horizontal/CustomHorizontalSlider";
import PersonSetting from "../system/PersonSetting";
const { Header, Content } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const CustomHeader = (props) => {
    const { theme, collapsed, onCollapse, userInfo} = props;
    const [settingShow, setSettingShow] = useState(false);
    /**
     * 状态修改
     * @type {*|Function}
     */
    const changeCollapsed = useCallback(() => {
        if (typeof onCollapse === 'function') {
            onCollapse(!collapsed);
        }
    }, [collapsed]);

    /**
     * 用户退出登录
     * @type {*|Function}
     */
    const loginOut = useCallback(() => {
        const mimeStorage = new MimeStorage();
        const casBaseURL = /^(http:\/\/|https:\/\/)/.test(window.APPROOTENV.casDomain) ?
            window.APPROOTENV.casDomain :
            window.APPROOTENV + window.APPROOTENV.casDomain;
        mimeStorage.removeItem('token');
        const url = window.location.origin + window.location.pathname + window.location.hash;
        window.location.href = casBaseURL + '?redirectUrl=' + url;
    }, []);

    /**
     * 取消保存
     * @type {Function|*}
     */
    const handleCancel = useCallback(() => {
        setSettingShow(false);
    }, []);

    /**
     * 确认保存
     * @type {Function|*}
     */
    const phandleOk = useCallback((data) => {
        setSettingShow(false);
        window._globalEvent.trigger('personConfigChange', { theme: data.theme, navModal: data.navModal});
    }, []);
    return (
        <Header className="site-layout-background" style={{ padding: 0, height: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            {
                props.navModal === 'vertical' ? (
                    <div>
                        {
                            !collapsed ?<MenuFoldOutlined style={{ fontSize: '20px', color: '#ffffff' }} onClick={changeCollapsed} />: <MenuUnfoldOutlined style={{ fontSize: '20px', color: '#ffffff' }} onClick={changeCollapsed} />
                        }
                    </div>
                ): null
            }
            {
                props.navModal === 'horizontal' ? <CustomHorizontalSlider userMenus={props.userMenus} firstMenus={props.firstMenus} theme={props.theme} collapsed={collapsed} />: null
            }

            <div style={{ display: 'flex', alignItems: 'center'}}>
               <div style={{height: '48px', display: 'flex'}}>
                   <div style={{color: theme !== 'dark' ? '#000000': '#ffffff', height: '48px', lineHeight: '48px', width: '100px', justifyContent: 'flex-end', display: 'flex'}}>你好, {userInfo.name}</div>
                   <Menu
                       mode="horizontal"
                       style={{ lineHeight: '48px', float: 'right' }}
                       theme={theme}
                       onClick={() => {}}
                   >
                       <SubMenu
                           title={
                               <span className="avatar">
                                    <Avatar
                                        src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                                    />
                                </span>
                           }
                       >
                           <MenuItemGroup title="用户中心">
                               <Menu.Item style={{height: '28px', lineHeight: '28px'}} key="setting:2">个人信息</Menu.Item>
                               <Menu.Item style={{height: '28px', lineHeight: '28px'}} key="logout">
                                   <span onClick={loginOut}>退出登录</span>
                               </Menu.Item>
                           </MenuItemGroup>
                           <MenuItemGroup title="设置中心">
                               <Menu.Item style={{height: '28px', lineHeight: '28px'}} key="setting:3">
                                   <span onClick={() => {
                                       setSettingShow(true);
                                   }}>个人设置</span>
                               </Menu.Item>
                               <Menu.Item style={{height: '28px', lineHeight: '28px'}} key="setting:4">系统设置</Menu.Item>
                           </MenuItemGroup>
                       </SubMenu>
                   </Menu>
               </div>
            </div>
            <PersonSetting isModalVisible={settingShow} phandleOk={phandleOk} handleCancel={handleCancel} navModal={props.navModal} theme={props.theme} ></PersonSetting>
        </Header>
    )
}
export default CustomHeader;

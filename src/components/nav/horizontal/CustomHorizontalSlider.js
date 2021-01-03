/**
 * Created by hao.cheng on 2017/4/13.
 */
import React, { useState, useEffect } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { Layout } from 'antd';
import { withRouter } from 'react-router-dom';
import CustomHorizontalSilderMenu from './CustomHorizontalSilderMenu';
import { useAlita } from 'redux-alita';
import {usePrevious, useSwitch} from "../../../scripts/customHooks";
import {getParent, treeFind} from "../../../scripts/utils";
const { Sider } = Layout;

const CustomHorizontalSlider = (props) => {
    const { firstMenus } = props;
    const [collapsed, tCollapsed] = useSwitch();
    const [firstHide, tFirstHide] = useSwitch();
    const [menu, setMenu] = useState({ openKeys: [''], selectedKey: firstMenus ? firstMenus.firstKey : '' });
    // 异步菜单
    const [smenus] = useAlita({ smenus: [] }, { light: true });
    const { location, collapsed: pCollapsed } = props;
    const prePathname = usePrevious(props.location.pathname);
    useEffect(() => {
        const getOpenAndSelectKeys = () => {
            let openKeys = [];
            const tempData = treeFind(props.userMenus, (node) => {
                return node.key === location.pathname + location.hash
            });
            if (tempData) {
                const parentNode = getParent(props.userMenus, tempData.id);
                openKeys = parentNode.map((item) => {
                    return item.key;
                });
            }

            return {
                // openKeys: recombineOpenKeys(location.pathname.match(/[/](\w+)/gi) || []),
                // openKeys: [ ...menu.openKeys, ...openKeys],
                openKeys: [],
                selectedKey: tempData?.key,
            };
        };

        if (pCollapsed !== collapsed) {
            setMenu(getOpenAndSelectKeys());
            tCollapsed.setSwitcher(!!pCollapsed);
            tFirstHide.setSwitcher(!!pCollapsed);
        }

        if (prePathname !== location.pathname) {
            setMenu(getOpenAndSelectKeys());
        }
    }, [prePathname, location.pathname, collapsed, tFirstHide, tCollapsed, pCollapsed]);

    const menuClick = (e) => {
        setMenu((state) => ({ ...state, selectedKey: e.key }));
        props.popoverHide?.(); // 响应式布局控制小屏幕点击菜单时隐藏菜单操作
    };

    const openMenu = (v) => {
        setMenu((state) => ({ ...state, openKeys: v }));
        tFirstHide.turnOff();
    };
    return (
            <CustomHorizontalSilderMenu
                menus={[...props.userMenus, ...smenus]}
                onClick={menuClick}
                mode="horizontal"
                theme={props.theme}
                selectedKeys={[menu.selectedKey]}
                openKeys={firstHide ? [] : menu.openKeys}
                onOpenChange={openMenu}
                // onClicknavfun={clickNavFun}
            />
    );
};
export default withRouter(CustomHorizontalSlider);

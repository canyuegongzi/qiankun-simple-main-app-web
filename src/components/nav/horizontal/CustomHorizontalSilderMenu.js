import React, { useState, useEffect } from 'react';
import { Menu } from 'antd';
import './horizontal.css'
import {
    DesktopOutlined,
} from '@ant-design/icons';

const clickNavFun = (item) => {
    if (item.system && item.key) {
        if (item.isIframe === false) {
            window.history.pushState({}, item.title, item.path);
        }
    }
}
const renderMenuItem = (
    item, props // item.route 菜单单独跳转的路由
) => (
    <Menu.Item key={item.key} onClick={() => clickNavFun(item)}>
        <div key={item.key}>
            {/*{item.icon && <Icon type={item.icon} />} */}
            <DesktopOutlined />
            <span className="nav-text">{item.title}</span>
        </div>
    </Menu.Item>
);

const renderSubMenu = (item, props) => {
    return (
        <Menu.SubMenu
            key={item.key}
            title={
                <span>
                    {/* {item.icon && <Icon type={item.icon} />} */}
                    <DesktopOutlined />
                    <span className="nav-text">{item.title}</span>
                </span>
            }
        >
            {item.children.map((sub) => (sub.children ? renderSubMenu(sub, props) : renderMenuItem(sub, props)))}
        </Menu.SubMenu>
    );
};

const CustomHorizontalSilderMenu = ({ menus, ...props }) => {
    const [dragItems, setDragItems] = useState([]);

    useEffect(() => {
        setDragItems(menus);
    }, [menus]);

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
    };
    const onDragEnd = (result) => {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const _items = reorder(dragItems, result.source.index, result.destination.index);
        setDragItems(_items);
    };
    return (
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            {
                menus.map((item) => {
                    return (<Menu {...props} key={item.id}>
                        {item.children
                            ? renderSubMenu(item, props)
                            : renderMenuItem(item, props)}
                    </Menu>)
                })
            }
        </div>
    );
};

export default React.memo(CustomHorizontalSilderMenu);

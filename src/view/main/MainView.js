import { Layout, Menu, Spin } from "antd";
import { Scrollbars } from 'react-custom-scrollbars';
import React from "react";
import './mainView.css';
import CustomVerticalSlider from "../../components/nav/vertical/CustomVerticalSlider";
import CustomHeader from "../../components/header/CustomHeader";

const { Header, Content } = Layout;

class MainView extends React.Component {
    state = {
        collapsed: false,
        contentHeight: document.body.clientHeight - 48 - 17
    };

    constructor(props) {
        super(props);
        const contentHeight = document.body.clientHeight - 48;
    }
    onCollapse = collapsed => {
        this.setState({ collapsed });
    };
    render() {
        const { collapsed } = this.state;
        return (
            <Layout style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
                {
                    this.props.navModal === 'vertical' ? <CustomVerticalSlider userMenus={this.props.userMenus} firstMenus={this.props.firstMenus} theme={this.props.theme} collapsed={collapsed} /> : null
                }
                <Layout className="site-layout">
                    <CustomHeader theme={this.props.theme} collapsed={collapsed} onCollapse={this.onCollapse} {...this.props} />
                    <Content style={{ height: this.state.contentHeight, backgroundColor: '#ffffff' }}>
                        <Scrollbars>
                            <Spin tip="Loading..." wrapperClassName="loadContainerClassName" spinning={this.props.appLoading}>
                                <div className="site-layout-background" dangerouslySetInnerHTML={{ __html: this.props.content || null }}>
                                </div>
                            </Spin>
                        </Scrollbars>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}
export default MainView;

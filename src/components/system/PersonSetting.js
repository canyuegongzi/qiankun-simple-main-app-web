import React, { useState, useCallback, useEffect } from 'react';
import {Form, Radio, Modal} from 'antd';
import {loadPersonConfig} from "../../scripts/customHooks";


const formItemLayout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 14 },
};
const PersonSetting = (props) => {
    const {theme, navModal} = props;
    const [formTheme, setFormTheme] = useState(loadPersonConfig() ? loadPersonConfig().theme : theme);
    const [formNavModal, setFormNavModal] = useState(loadPersonConfig() ? loadPersonConfig().navModal : navModal);

    useEffect(() => {
        setFormTheme(theme);
        setFormNavModal(navModal);
    }, [props]);
    /**
     * 保存配置
     * @type {Function|*}
     */
    const saveSetting = useCallback(() => {
        if (typeof props.phandleOk === 'function') {
            props.phandleOk({theme: formTheme, navModal: formNavModal});
        }
    }, [props, formTheme, formNavModal]);
    /**
     * 取消配置
     * @type {Function|*}
     */
    const cancleSetting = useCallback(() => {
        if (typeof props.handleCancel === 'function') {
            props.handleCancel();
        }
    }, [props]);

    const onValuesChange = (changedValues, allValues) => {
        // console.log('Received values of form: ', changedValues, allValues);
    };

    /**
     * 主题值修改
     * @param e
     */
    const ontThemeChange = (e) => {
        setFormTheme(e.target.value);
    }

    /**
     * 主题值修改
     * @param e
     */
    const ontNavModalChange = (e) => {
        setFormNavModal(e.target.value);
    }

    return (
        <Modal title="个人设置" cancelText="取消" okText="确定" visible={props.isModalVisible} onOk={saveSetting} onCancel={cancleSetting}>
            <Form
                name="validate_other"
                {...formItemLayout}
                onValuesChange={onValuesChange}
            >
                {/*<Form.Item name="theme" label="主题色">
                    <Radio.Group value={formTheme} defaultValue={formTheme}  onChange={ontThemeChange} >
                        <Radio value="dark">暗色</Radio>
                        <Radio value="light">亮色</Radio>
                    </Radio.Group>
                </Form.Item>*/}
                <Form.Item name="navModal" label="菜单样式">
                    <Radio.Group value={formNavModal} defaultValue={formNavModal} onChange={ontNavModalChange} >
                        <Radio value="vertical">纵向</Radio>
                        <Radio value="horizontal">横向</Radio>
                    </Radio.Group>
                </Form.Item>
            </Form>
        </Modal>
    )
}
export default PersonSetting;

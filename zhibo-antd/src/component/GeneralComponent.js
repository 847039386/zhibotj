import React, { forwardRef, useState } from 'react';
import { Col, DatePicker, Form, Input, Row, InputNumber, TimePicker, Switch, Typography, Radio } from 'antd';
import { ModalForm } from '@ant-design/pro-components';

/**
 * @class GeneralComponent
 * @extends React.Component
 * @param {Number} width                (选填)      表单大小         
 * @param {String} title                (选填)      表单标题   
 * @param {String} titleTip             (选填)      表单标题提醒         
 * @param {Boolean} visible             (必填)      隐藏   
 * @param {Object} format               (必填)      表单格式   
 * @param {String} layout               (选填)      表单样式    
 * @param {Number} submitTimeout        (选填)      提交数据时，禁用取消按钮的超时时间（毫秒）                          
 * @param {Object} initialValues        (选填)      表单默认数据
 * @param {JSX.Element} trigger         (选填)      ProComponents的表单trigger   
 * @param {Function} init               (选填)      页面初始化的执行                              
 * @param {Function} onClose            (必填)      关闭后的回调                                
 * @param {Function} onFinish           (必填)      表单提交的回调                           
 */

const GeneralComponent = (props, ref) => {

    const [format, setFormat] = useState(props.format || [])
    const [title, setTitle] = useState(props.title || '表单')
    const [titleTip, setTitleTip] = useState(props.titleTip)
    const [width, setWidth] = useState(props.width || 800)
    const [submitTimeout, setSubmitTimeout] = useState(props.submitTimeout || 5000)
    const [initialValues, setInitialValues] = useState(props.initialValues || [])
    const [layout, setLayout] = useState(props.layout || 'horizontal')
    const [styleModal, setStyleModal] = useState(props.styleModal || { padding: 10 })

    const componentDidMount = () => {
        if (props.init) {
            props.init();
        }
    }

    const onFinish = async (formData) => {
        if (props.onFinish) {
            await props.onFinish(formData)
        }
        return true
    }

    const onClose = async (e) => {
        if (props.onClose) {
            props.onClose()
        }
    }

    return (
        props.visible ? (
            <ModalForm formRef={ref} submitTimeout={submitTimeout} initialValues={initialValues} trigger={props.trigger} autoFocusFirstInput visible={props.visible} modalProps={{
                style: styleModal,
                onCancel: onClose
            }} width={props.width} layout={layout} onFinish={onFinish}
                title={
                    <div>
                        <Typography.Text strong style={{ color: 'rgba(0, 0, 0, 0.85)', fontSize: 18 }}>{props.title}</Typography.Text>
                        <Typography.Text type='secondary' italic style={{ fontSize: 12, marginLeft: 15 }}>{props.titleTip}</Typography.Text>
                    </div>
                } >
                {
                    format.map((box, index) => {
                        return (
                            <div key={`FORMGCCTROW${index}`}>
                                {box.children ? (box.children.start ? box.children.start : null) : null}
                                <Row gutter={box.gutter || 24}>
                                    {
                                        box.FormItem.map((item, zindex) => {
                                            return (
                                                <GeneralFormItemComponent key={`FORMGCCTITEM${zindex}`} span={item.span} props={item.props} input={item.input} />
                                            )
                                        })
                                    }
                                </Row>
                                {box.children ? (box.children.end ? box.children.end : null) : null}
                            </div>

                        )
                    })
                }

            </ModalForm>
        ) : null
    )
};

class GeneralInputComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    render = () => {
        if (!this.props.children) {
            var input = <Input {...this.props} />
            if (this.props.cmode == 'InputNumber') {
                input = <InputNumber {...this.props} />
            } else if (this.props.cmode == 'TimePicker') {
                input = <TimePicker {...this.props} />
            } else if (this.props.cmode == 'DatePicker') {
                input = <DatePicker {...this.props} />
            } else if (this.props.cmode == 'TextArea') {
                input = <Input.TextArea {...this.props} />
            } else if (this.props.cmode == 'Switch') {
                input = <Switch {...this.props} />
            } if (this.props.cmode == 'Radio') {
                input = <Radio.Group {...this.props} />
            }
            return input
        } else {
            return this.props.children
        }
    }
}

class GeneralFormItemComponent extends React.Component {
    constructor(props) {
        super(props)
    }
    render = () => {
        return (
            this.props.input && this.props.props ?
                <Col span={this.props.span}>
                    <Form.Item {...this.props.props} >
                        <GeneralInputComponent cmode={this.props.input.type} children={this.props.input.children} {...this.props.input.props} />
                    </Form.Item>
                </Col> :
                <Col span={this.props.span}></Col>


        )
    }
}

export default forwardRef(GeneralComponent)



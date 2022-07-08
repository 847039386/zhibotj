
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal, notification } from 'antd';
import React from 'react';
const { confirm } = Modal;

const waitTime = (time = 1000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};


const rmModal = (cb1, cb2) => {
    confirm({
        content: '是否删除该条数据？',
        async onOk() {
            await waitTime(1000)
            confirm({
                content: '删除后，数据将无法挽回，您是否知道？',
                okText: '我知道',
                cancelText: '不知道',
                async onOk() {
                    await waitTime(1000)
                    confirm({
                        content: '最后一次了！真的很重要，您是否确定删除？',
                        okText: '我确定',
                        cancelText: '算了吧',
                        async onOk() {
                            await waitTime(1000)
                            if (cb1) { cb1() }
                        },
                        onCancel() {
                            if (cb2) { cb2() }
                        },
                    });
                },
                onCancel() {
                    if (cb2) { cb2() }
                },
            });
        },
        onCancel() {
            if (cb2) { cb2() }
        },
    });

    //测试用这个
    // cb1()
};

const tipModal = (cb1, cb2) => {
    confirm({
        title: '提示',
        icon: <ExclamationCircleOutlined />,
        content: '确认执行该操作？',
        onOk() {
            if (cb1) { cb1() }
        },
        onCancel() {
            if (cb2) { cb2() }
        },
    });
};

const addMsg = async (table, field) => {
    await waitTime()
    notification.open({
        message: '消息',
        placement: 'bottomLeft',
        description: <OpSpan type={'ct'} table={table} field={field} />,
    });

}

const utMsg = async (table, field) => {
    await waitTime()
    notification.open({
        message: '消息',
        placement: 'bottomLeft',
        description: <OpSpan type={'ut'} table={table} field={field} />,
    });

}


const rmMsg = async (table, field) => {
    await waitTime()
    notification.open({
        message: '消息',
        placement: 'bottomLeft',
        description: <OpSpan type={'rm'} table={table} field={field} />,
    });

}

const addWorkMsg = async (field) => {
    await waitTime()
    notification.open({
        message: '消息',
        placement: 'bottomLeft',
        description: <OpSpan type={'work'} field={field} />,
    });

}


//err
const errMsg = async (msg) => {
    await waitTime()
    notification.open({
        message: '错误！',
        description: <OpSpan type={'err'} msg={msg} />,
    });
}

const msg = async (msg) => {
    await waitTime()
    notification.open({
        message: '提示',
        description: <OpSpan type={'msg'} msg={msg} />,
    });
}




class OpSpan extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        if (this.props.type === 'rm') {
            return (
                <div>您删除了 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.table}</span> 表中编号 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.field || '未设置'}</span> 的这条数据</div>
            );
        } else if (this.props.type === 'ut') {
            return (
                <div>您修改了 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.table}</span> 表中编号 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.field || '未设置'}</span> 的这条数据</div>
            );
        } else if (this.props.type === 'ct') {
            return (
                <div>您向 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.table}</span> 表中添加了 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.field || '未设置'}</span> 这条数据</div>
            );
        } else if (this.props.type === 'err') {
            return (
                <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.msg}</span>
            );
        } if (this.props.type === 'work') {
            return (
                <div>您添加了 <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.field}</span> 今天的直播统计</div>
            );
        } else {
            return (
                <span style={{ color: '#f50', fontWeight: 'bold' }}>{this.props.msg}</span>
            )
        }

    }

}




export { rmModal, rmMsg, tipModal, addMsg, errMsg, msg, utMsg, addWorkMsg }

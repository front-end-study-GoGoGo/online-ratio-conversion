import React from 'react';
import { FC, useEffect, useState } from 'react';
import { Button, Input, Space, InputNumber, Form, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import './RatioCalculateTool.less';


const recognitionValueInfo = "可将','或'*'或'x'分隔的数值快速填充到左侧待转数值列,目前可以最多识别6个数";

const copyValueInfo = "点击快捷复制按钮可以快速复制";

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const RatioCalculateTool: FC = () => {
    const [awaitConvertValueList, setAwaitConvertValueList] = useState([0, 0, 0]); // 待转换数值列表
    const [convertValueList, setConvertValueList] = useState([0, 0, 0]); // 已转换数值列表
    const [conversionRateValue, setConversionRateValue] = useState<number>(2); // 转换数值
    const [recognitionValue, setRecognitionValue] = useState(''); // 快捷识别数值 
    const [copyValue, setCopyValue] = useState(''); // 快捷复制数值 
    const [messageApi, contextHolder] = message.useMessage();

    const successClue = () => {
        messageApi.open({
            type: 'success',
            content: '复制成功',
        });
    };

    const [form_left] = Form.useForm();
    const [form_right] = Form.useForm();

    const onChangeConversionRate = (value) => {
        console.log('onChangeConversionRate--->', value);
        setConversionRateValue(value)
    }

    const onFinishLeftForm = (value) => {
        console.log('onFinishLeftForm--->', value);
        let tempArr: number[] = [];
        tempArr = Object.values(value).map((item: number) => {
            return item * conversionRateValue
        })
        setConvertValueList(tempArr);
        areSetForm(form_right, tempArr)
    }

    const onFinishRightForm = (value) => {
        console.log('onFinishRightForm--->', value);
    }

    /**
     * 将一个数组的值顺序写入form
     * @formInstance form实例对象
     * @list 数组
     * 
     */
    const areSetForm = (formInstance, list: number[]) => {
        let tempObj = {}
        if (formInstance && formInstance.setFieldsValue) {
            list.map((item, index) => {
                tempObj[`value_${index + 1}`] = item;
            })
            formInstance.setFieldsValue({ ...tempObj });
        }
    }

    /**
     * 一键转换按钮
     */
    const oneKeyConvert = () => {
        form_left.submit();
    }

    /**
     * 识别按钮 
     */
    const recognitionButton = () => {
        console.log('recognitionValue--->', recognitionValue);
        let tempArr: number[] = [], tempValue = 0;
        // 目前暂不支持字符串里面带小数的，后期会考虑支持
        for (let i = 0; i < recognitionValue.length; i++) {
            console.log(recognitionValue[i]);
            if (recognitionValue[i] === ',' || recognitionValue[i] === '，' || recognitionValue[i] === 'x' || recognitionValue[i] === '*') {
                tempArr.push(tempValue);
                tempValue = 0;
                continue;
            } else {
                tempValue = tempValue * 10 + Number(recognitionValue[i])
            }
        }
        tempArr.push(tempValue);
        setAwaitConvertValueList(tempArr)
    }

    /**
     * 复制按钮
     */
    const copyButton = () => {
        copy(copyValue);
    }

    /**
     * 复制内容到粘贴板
     */
    const copy = (text) => {
        // text是复制文本
        // 创建input元素
        const el = document.createElement('input')
        // 给input元素赋值需要复制的文本
        el.setAttribute('value', text)
        // 将input元素插入页面
        document.body.appendChild(el)
        // 选中input元素的文本
        el.select()
        // 复制内容到剪贴板
        document.execCommand('copy')
        // 删除input元素
        document.body.removeChild(el)
        successClue();
    }

    useEffect(() => {
        areSetForm(form_left, awaitConvertValueList);
    }, [awaitConvertValueList])

    useEffect(() => {
        setCopyValue(convertValueList)
    }, [convertValueList])

    return (
        <div className="RatioCalculateTool-mainContainer">
            {contextHolder}
            <div className="github-icon" title='github源码地址' onClick={() => { window.open('https://github.com/front-end-study-GoGoGo/online-ratio-conversion') }}>
                <svg height="32" aria-hidden="true" viewBox="0 0 16 16" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle">
                    <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
                </svg>
            </div>
            <div>
                <Space>
                    <Button onClick={() => { recognitionButton() }}>快捷识别</Button>
                    <Input style={{ width: '300px' }} value={recognitionValue} onChange={(e) => setRecognitionValue(e.target.value)} placeholder={`用','或'*'或'x'分隔`}></Input>
                    <InfoCircleOutlined title={recognitionValueInfo} />
                </Space>
            </div>
            <div>
                <Space>
                    <Button onClick={() => { copyButton() }}>快捷复制</Button>
                    <Input style={{ width: '300px' }} value={copyValue} onChange={(e) => setCopyValue(e.target.value)}></Input>
                    <InfoCircleOutlined title={copyValueInfo} />
                </Space>
            </div>
            <div className="RatioCalculateTool-contentBox">
                <div className="RatioCalculateTool-left">
                    <div>待转数值列</div>
                    <Form {...layout} form={form_left} name="control-hooks" onFinish={onFinishLeftForm}>
                        {awaitConvertValueList.map((item, index) => {
                            return <Form.Item key={index} name={`value_${index + 1}`} label={`待转数值_${index + 1}`}>
                                <Input />
                            </Form.Item>
                        })}
                    </Form>
                </div>
                <div className="RatioCalculateTool-center">
                    <Space direction="vertical" size={20}>
                        <div>
                            转换倍数:&nbsp;&nbsp;<InputNumber min={-100} max={1000} value={conversionRateValue} defaultValue={3} onChange={onChangeConversionRate}></InputNumber>
                        </div>
                        <Button onClick={() => { oneKeyConvert() }}>一键转换</Button>
                        {/* <Button onClick={() => {}}>计算第一行之间比值</Button> */}
                        {/* <Button>增加行</Button>
                        <Button>减少行</Button> */}
                    </Space>
                </div>
                <div className="RatioCalculateTool-right">
                    <div>已转数值列</div>
                    <Form {...layout} form={form_right} name="control-hooks" onFinish={onFinishRightForm}>
                        {awaitConvertValueList.map((item, index) => {
                            return <Form.Item key={index} name={`value_${index + 1}`} label={`已转数值_${index + 1}`}>
                                <Input />
                            </Form.Item>
                        })}
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default RatioCalculateTool;

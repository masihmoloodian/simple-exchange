
import './App.css';
import { Table, DatePicker, Select, Button, InputNumber, Layout, Row, Col, Space, message } from 'antd'
import axios from 'axios';
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
const BASE_URL = process.env.REACT_APP_API_BASE_URL
const SOCKET_BASE_URL = process.env.REACT_APP_SOCKET_BASE_URL

function App() {

    /**
     * States
     */    
    const [swapForm, setSwapForm] = useState({ currencyFrom: 'BTC', amountFrom: 1, currencyTo: 'USD'})
    const [dateFilter, setDateFilter] = useState({ fromDate: '', toDate: ''})
    const [exchangeType, setExchangeType] = useState('')
    const [currencyPrice, setCurrencyPrice] = useState('')
    const [dateSource, setDateSource] = useState([])
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [socketData, setSocketData] = useState(null);
    const socket = useRef();

    useEffect(() => {
        // Get Table data from api
        fetchRecords(1, dateFilter.fromDate, dateFilter.toDate, exchangeType);

        socket.current = io(SOCKET_BASE_URL, {
            transport: ["websocket"],
        });
        socket.current.on("price", (data) => {
            setSocketData(data)
            const temp = data.filter((i) => i.fiat === swapForm.currencyTo && i.crypto === swapForm.currencyFrom)
            setCurrencyPrice(temp[0].amount)
        });
        return () => {
            socket.current.disconnect();
        }
    }, [currencyPrice]);


    const [messageApi, contextHolder] = message.useMessage();
    const successMessage = () => {
        messageApi.open({
          content: 'Exchange submitted',
          className: 'custom-class',
          icon: '',
        });
    };

    const handleSwapClick = () => {
        setLoading(true);
        axios
        .post(`${BASE_URL}/exchange`,
            {
                "currencyFrom": swapForm.currencyFrom,
                "amountFrom": swapForm.amountFrom,
                "currencyTo": swapForm.currencyTo,
                "amountTo": Number((currencyPrice * swapForm.amountFrom).toFixed(2))
            } 
        ).then((res) => {
            fetchRecords(1, '', '', '');
            successMessage()
        });
    }

    function handleDatePickerFrom(date) {
        setDateFilter({
            fromDate: new Date(date.$d),
            toDate: dateFilter.toDate
        })
    }

    function handleDatePickerTo(date) {
        setDateFilter({
            fromDate: dateFilter.fromDate,
            toDate: new Date(date.$d)
        })
    }

    function handleFilterClick() {
        fetchRecords(1, dateFilter.fromDate, dateFilter.toDate, exchangeType);
    }

    const columns = [
        { title : 'Date & Time', dataIndex: 'created_at' },
        { title : 'Currency From', dataIndex: 'currencyFrom' },
        { title : 'Amount 1', dataIndex: 'amountFrom' },
        { title : 'Currency To', dataIndex: 'currencyTo' },
        { title : 'Amount 2', dataIndex: 'amountTo' },
        { title : 'Type', dataIndex: 'type', key: 'type', render: (text) => {
            if (text === 'Live Price') {
                return <span style={{ fontWeight:'bold', color: '#5DBE7E' }}>{text}</span>
            } else {
                return <span style={{ fontWeight:'bold', color: '#6368DF' }}>{text}</span>
            }
        } },
    ];
    
    const fetchRecords = (page, fromDate, toDate, type) => {
        setLoading(true);
        axios
        .get(`${BASE_URL}/exchange?pageNumber=${page}&type=${type}&fromDate=${fromDate}&toDate=${toDate}`)
        .then((res) => {
            const tableData = res.data.data
            tableData.map(el => {
                let date = new Date(el.created_at)
                el.created_at = date.getDate()+"/"+(date.getMonth() + 1)+"/"+date.getFullYear() + " " +date.getHours() + ':' + date.getMinutes()
            })
            setDateSource(tableData);
            setTotalPages(res.data.metadata.total);
            setLoading(false);
        });
    };


    return (
        <Layout>
            <div className="App ">
                <div className='header'>
                    <div className='container'>
                        <div className='head'>
                            <h2>Exchange</h2>
                        </div>
                        <Row justify="left">
                        <Col span={4}>
                            <label className='label-head'>Currency form</label>
                            <Select
                                showSearch
                                placeholder="Curreny"
                                defaultValue={'BTC'}
                                optionFilterProp="children"
                                addOnBefore="Currency"
                                className='box-form'
                                onChange={value => {
                                    setSwapForm({ currencyFrom: value, amountFrom: swapForm.amountFrom, currencyTo: swapForm.currencyTo })
                                    const temp = socketData.filter((i) => i.fiat === swapForm.currencyTo && i.crypto === value)
                                    setCurrencyPrice(temp[0].amount)
                                }}
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                    {
                                        value: 'BTC',
                                        label: (
                                            <div className="wrapper-label">
                                                <img style={{ height: '20px', width: '20px' }} src='https://cryptologos.cc/logos/bitcoin-btc-logo.png'/>
                                                <span>Bitcoin</span>
                                            </div>
                                        ),
                                    },
                                    {
                                        value: 'ETH',
                                        label: (
                                            <div className="wrapper-label">
                                                <img style={{ height: '20px', width: '20px' }} src='https://seeklogo.com/images/E/ethereum-blue-logo-8BC914153E-seeklogo.com.png'/>
                                                <span>Ethereum</span>
                                            </div>
                                        ),
                                    },
                                ]}
                            > 
                            
                            </Select>
                            </Col>
                            <Col span={3}>
                            <label className='label-head'>Amount</label>
                            <InputNumber className='box-form'
                                defaultValue={1}
                                onChange={value => setSwapForm({ currencyFrom: swapForm.currencyFrom, amountFrom: value, currencyTo: swapForm.currencyTo })}
                            />
                            </Col>
                            <Col span={4}>
                            <label className='label-head'>Currency to</label>
                            <Select  
                                showSearch
                                placeholder="Curreny"
                                optionFilterProp="children"
                                defaultValue={'USD'}
                                className='box-form btn-tus'
                                onChange={value => {   
                                    setSwapForm({ currencyFrom: swapForm.currencyFrom, amountFrom: swapForm.amountFrom, currencyTo: value })

                                    const temp = socketData.filter((i) => i.crypto === swapForm.currencyFrom && i.fiat === swapForm.currencyTo)
                                    setCurrencyPrice(temp[0].amount)
                                }
                            }
                                filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                options={[
                                {
                                    value: 'USD',
                                    label: (
                                        <div className="wrapper-label">
                                            <img style={{ height: '20px', width: '20px' }} src='https://png.pngitem.com/pimgs/s/34-348356_the-united-states-flag-round-png-usa-flag.png'/>
                                            <span>USD</span>
                                        </div>
                                    ),
                                },
                                {
                                    value: 'EUR',
                                    label: (
                                        <div className="wrapper-label">
                                            <img style={{ height: '20px', width: '20px' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRkJ4eTKuW2W9BlVf2ESXx4JnoTgmKmlk6emPQcC-5Q1A&s'/>
                                            <span>EUR</span>
                                        </div>
                                    ),
                                },
                                ]}
                            />
                            </Col>
                            <Col span={3}>
                            <label className='label-head'>Amount</label>
                                <InputNumber className='box-form' value={currencyPrice ? (currencyPrice * swapForm.amountFrom).toFixed(2) : 'loading...'} />
                            </Col>
                            <Col span={2} className="btn">
                            {contextHolder}
                            <Button onClick={handleSwapClick}>Save</Button>
                            </Col>

                        </Row>
                    </div>
                </div>
                <div className="history">
                    <div className='container'>
                        <div className='head'>
                            <h2>History</h2>
                        </div>
                        <div className='body'>
                            <Row justify="left">
                            <Col span={4}>
                                <label className='label-head'>From date</label>
                                    <Space direction="vertical">
                                        <DatePicker onChange={handleDatePickerFrom} />
                                    </Space>
                                </Col>
                                <Col span={4}>
                                <label className='label-head'>To date</label>
                                    <Space direction="vertical">
                                        <DatePicker onChange={handleDatePickerTo} />
                                    </Space>
                                </Col>
                                <Col span={4}>
                                    <label className='label-head'>Type</label>
                                    <Select
                                    showSearch
                                    placeholder="Type"
                                    defaultValue=""
                                    optionFilterProp="children"
                                    className='box-form'
                                    onChange={value => setExchangeType(value)}
                                    filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: 'All',
                                        },
                                        {
                                            value: 'Live Price',
                                            label: 'Live Price',
                                        },
                                        {
                                            value: 'Exchanged',
                                            label: 'Exchanged',
                                        },
                                    ]}
                                />
                                </Col>
                                
                                <Col span={2} className="btn">
                                <Button onClick={handleFilterClick} type="primary" ghost>Filter</Button>
                                </Col>
                            </Row>
                        </div>
                        <div className='foot'>
                            <Table className='historyTable'
                                loading={loading}
                                columns={columns}
                                dataSource={dateSource}
                                onChange
                                pagination={{
                                    pageSize: 4,
                                    total: totalPages,
                                    onChange: (page) => {
                                        fetchRecords(page, '', '', '');
                                    },
                                    position: ['left', 'bottom'],
                                }}
                            ></Table>
                        </div>
                    </div>
                </div>
            </div>        
        </Layout>
    );
}

export default App;
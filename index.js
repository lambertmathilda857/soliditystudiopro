// 引入所需的库
const express = require('express');
const Web3 = require('web3');
const dotenv = require('dotenv');
const morgan = require('morgan');
const axios = require('axios');

// 加载环境变量
dotenv.config();

// 设置Web3提供者
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Express应用设置
const app = express();
app.use(express.json());
app.use(morgan('dev')); // 使用morgan库进行日志记录

// 智能合约设置
const contractABI = require('./contractABI.json'); // 假设ABI存储在同级目录的文件中
const contractAddress = process.env.CONTRACT_ADDRESS; // 假设合约地址存储在.env文件中
const contract = new web3.eth.Contract(contractABI, contractAddress);

// API路由
app.get('/api/contractData', async (req, res) => {
    try {
        // 调用智能合约的某个方法
        const data = await contract.methods.someMethod().call();
        res.json({ success: true, data });
    } catch (error) {
        console.error(`Error fetching contract data: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error fetching contract data' });
    }
});

app.post('/api/sendTransaction', async (req, res) => {
    try {
        // 发送交易
        const { fromAddress, toAddress, amount } = req.body;
        const transaction = {
            // 这里是交易的必要信息，例如：from, to, value, gas, etc.
            from: fromAddress,
            to: toAddress,
            value: web3.utils.toWei(amount, 'ether')
        };

        // 这里发送交易，并等待回执
        const receipt = await web3.eth.sendTransaction(transaction);
        res.json({ success: true, receipt });
    } catch (error) {
        console.error(`Error sending transaction: ${error.message}`);
        res.status(500).json({ success: false, message: 'Error sending transaction' });
    }
});

// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// 服务器启动
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

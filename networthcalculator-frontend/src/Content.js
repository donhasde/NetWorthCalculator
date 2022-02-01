import TableGroup from './TableGroup'
import NumberFormat from "react-number-format";
import { useState, useEffect } from 'react'

const Content = () => {
    const [userId, setUserId] = useState(0);
    const [equity, setEquity] = useState({});
    const [currency, setCurrency] = useState("CAD");
    const [totalAssets, setTotalAssets] = useState(0.00);
    const [totalLiabilities, setTotalLiabilities] = useState(0.00);
    const [netWorth, setNetWorth] = useState(0.00);

    const currencyConfig = {
        AUD:{symbol:"$", thousand:',', decimal:'.'},
        CAD:{symbol:"$", thousand:',', decimal:'.'},
        CHF:{symbol:"fr.", thousand:'.', decimal:','},
        CNY:{symbol:"¥", thousand:',', decimal:'.'},
        EUR:{symbol:"€", thousand:'.', decimal:','},
        GBP:{symbol:"£", thousand:',', decimal:'.'},
        HKD:{symbol:"HK$", thousand:',', decimal:'.'},
        JPY:{symbol:"¥", thousand:',', decimal:'.'},
        NZD:{symbol:"$", thousand:',', decimal:'.'},
        USD:{symbol:"$", thousand:',', decimal:'.'}
    }

    const assetList = [
        {label: 'Chequing', id: 'chequing'},
        {label: 'Savings for Taxes', id: 'taxSavings'},
        {label: 'Rainy Day Fund', id: 'emergencySavings'},
        {label: 'Savings for Fun', id: 'funSavings'},
        {label: 'Savings for Travel', id: 'travelSavings'},
        {label: 'Savings for Personal Development', id: 'personalSavings'},
        {label: 'Investment 1', id: 'investment1'},
        {label: 'Investment 2', id: 'investment2'},
        {label: 'Investment 3', id: 'investment3'},
        {label: 'Primary Home', id: 'primaryHome'},
        {label: 'Second Home', id: 'secondHome'},
        {label: 'Other', id: 'other'}
    ];
    const liabilitiesList = [
        {label: 'Credit Card 1', id: 'creditCard1'},
        {label: 'Credit Card 2', id: 'creditCard2'},
        {label: 'Mortgage 1', id: 'mortgage1'},
        {label: 'Mortgage 2', id: 'mortgage2'},
        {label: 'Line of Credit', id: 'lineOfCredit'},
        {label: 'Investment Loan', id: 'investmentLoan'},
    ];

    useEffect(() => {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };
        const endpoint = 'http://localhost:8080/api/v1/user/'+ JSON.stringify(userId);
        fetch(endpoint, requestOptions)
            .then(response => response.json())
            .then(data => { updateData(data) })
        .catch(console.log);
    }, []);

    const updateData = ((data) => {
        console.log("Result: " + JSON.stringify(data));

        changeCurrency(data.baseCurrencyCode);

        const newEquity = {};
        if(data.assets !== null)
            Object.entries(data.assets)
                .map(([key, value]) => (newEquity[key] = value));
        if(data.liabilities !== null)
            Object.entries(data.liabilities)
                .map(([key, value]) => (newEquity[key] = value));
        setEquity(newEquity);
        setUserId(data.userId);
        setTotalAssets(data.totalAssets);
        setTotalLiabilities(data.totalLiabilities);
        setNetWorth(data.totalNetWorth);
    });

    const changeCurrency = (targetCurrency) => {
        if (targetCurrency == null)
            targetCurrency=currency;
        setCurrency(targetCurrency);
    }

    const onCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        const oldCurrency = currency;
        changeCurrency(newCurrency);
        calculateEquity(equity, oldCurrency, newCurrency);
    }

    const onInputChange = (values, sourceInfo) => {
        if (sourceInfo.source !== "event")
            return;

        const id = sourceInfo.event.target.id;
        let value = values.value;
        if (!value)
            value = 0;

        const newEquity = {
            ...equity,
            [id]: value
        }
        setEquity(newEquity);
        calculateEquity(newEquity, currency);
    }

    const calculateEquity = (equity, baseCurrencyCode, targetCurrencyCode) => {
        const assetMap = new Map();
        assetList
            .filter(entry => entry.id in equity)
            .map(entry => assetMap.set(entry.id, equity[entry.id]));
        const assets = Object.fromEntries(assetMap);

        const liabilitiesMap = new Map();
        liabilitiesList
            .filter(entry => entry.id in equity)
            .map(entry => liabilitiesMap.set(entry.id, equity[entry.id]));
        const liabilities = Object.fromEntries(liabilitiesMap);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId,
                baseCurrencyCode,
                targetCurrencyCode,
                assets,
                liabilities
            })
        };
        console.log("Fetching with request: " + requestOptions.body);

        fetch('http://localhost:8080/api/v1/calculateNetWorth', requestOptions)
            .then(response => response.json())
            .then(data => { updateData(data) })
        .catch(console.log);
    }

    return (
        <div className="Content">
            <div className="right">
                <label htmlFor="currency">Select Currency: </label>
                <select name="currency" id="currency" value={currency} onChange={onCurrencyChange}>
                    <option value="AUD">AUD</option>
                    <option value="CAD">CAD</option>
                    <option value="CHF">CHF</option>
                    <option value="CNY">CNY</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="HKD">HKD</option>
                    <option value="JPY">JPY</option>
                    <option value="NZD">NZD</option>
                    <option value="USD">USD</option>
                </select><br/>
            </div>

            <NumberFormat
                value={netWorth || 0}
                displayType="text"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={currencyConfig[currency].thousand}
                decimalSeparator={currencyConfig[currency].decimal}
                prefix={currencyConfig[currency].symbol}
                renderText={(value, props) => <p>Net Worth: {value}</p>}
            />

            <hr className="solidLine"></hr>

            <table>
                <tbody><tr><th scope="row">Assets</th></tr></tbody>
                <TableGroup data={assetList.slice(0, 9)} label="Cash and Investments" format={currencyConfig[currency]} state={equity} onChange={onInputChange}/>
                <TableGroup data={assetList.slice(9, assetList.length)} label="Long Term Assets" format={currencyConfig[currency]} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Assets</th>
                        <td className="mid">{currencyConfig[currency].symbol}</td>
                        <td>
                            <NumberFormat
                                className="right"
                                value={totalAssets || 0}
                                displayType="input"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={currencyConfig[currency].thousand}
                                decimalSeparator={currencyConfig[currency].decimal}
                                readOnly="readOnly"
                            />
                        </td>
                    </tr>
                    <tr className="break"><td/></tr>
                </tbody>

                <tbody><tr><th scope="row">Liabilities</th></tr></tbody>
                <TableGroup data={liabilitiesList.slice(0,2)} label="Short Term Liabilities" format={currencyConfig[currency]} state={equity} onChange={onInputChange}/>
                <TableGroup data={liabilitiesList.slice(2,liabilitiesList.length)} label="Long Term Debt" format={currencyConfig[currency]} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Liabilities</th>
                        <td className="mid">{currencyConfig[currency].symbol}</td>
                        <td>
                            <NumberFormat
                                className="right"
                                value={totalLiabilities || 0}
                                displayType="input"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={currencyConfig[currency].thousand}
                                decimalSeparator={currencyConfig[currency].decimal}
                                readOnly="readOnly"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default Content;
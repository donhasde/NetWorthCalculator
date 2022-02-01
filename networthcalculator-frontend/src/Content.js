import TableGroup from './TableGroup'
import NumberFormat from "react-number-format";
import { useState, useEffect } from 'react'

const Content = () => {
    const [equity, setEquity] = useState({});
    const [currencyFormat, setCurrencyFormat] = useState({
        currency:"CAD",
        thousand:',',
        decimal:'.',
        symbol:'$',
    });
    const [totalAssets, setTotalAssets] = useState(0.00);
    const [totalLiabilities, setTotalLiabilities] = useState(0.00);
    const [netWorth, setNetWorth] = useState(0.00);

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

    const onCurrencyChange = (event) => {
        const newCurrency = event.target.value;
        const oldCurrency = currencyFormat.currency;

        const newCurrencyFormat = {
            currency:newCurrency,
            thousand:event.target.selectedOptions[0].getAttribute('thousand'),
            decimal:event.target.selectedOptions[0].getAttribute('decimal'),
            symbol:event.target.selectedOptions[0].getAttribute('symbol'),
        }
        setCurrencyFormat(newCurrencyFormat);
        calculateEquity(equity, oldCurrency, newCurrency);
    }

    const onInputChange = (values, sourceInfo) => {
        if (sourceInfo.source !== "event")
            return;

        console.log(sourceInfo)
        const id = sourceInfo.event.target.id;
        const value = values.value;
        const newEquity = {
            ...equity,
            [id]: value
        }
        setEquity(newEquity);
        calculateEquity(newEquity, currencyFormat.currency);
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
                baseCurrencyCode,
                targetCurrencyCode,
                assets,
                liabilities
            })
        };
        console.log("Fetching with request: " + requestOptions.body);

        fetch('http://localhost:8080/api/v1/calculateNetWorth', requestOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Result: " + JSON.stringify(data));
                Object.entries(data.assets)
                    .map(([key, value]) => (equity[key] = value));
                Object.entries(data.liabilities)
                    .map(([key, value]) => (equity[key] = value));
                setTotalAssets(data.totalAssets);
                setTotalLiabilities(data.totalLiabilities);
                setNetWorth(data.totalNetWorth);
            })
        .catch(console.log);
    }

    return (
        <div className="Content">
            <div className="right">
                <label htmlFor="currency">Select Currency: </label>
                <select name="currency" id="currency" defaultValue={currencyFormat.currency} onChange={onCurrencyChange}>
                    <option value="AUD" symbol="$" thousand=',' decimal='.'>AUD</option>
                    <option value="CAD" symbol="$" thousand=',' decimal='.'>CAD</option>
                    <option value="CHF" symbol="fr." thousand='.' decimal=','>CHF</option>
                    <option value="CNY" symbol="¥" thousand=',' decimal='.'>CNY</option>
                    <option value="EUR" symbol="€" thousand='.' decimal=','>EUR</option>
                    <option value="GBP" symbol="£" thousand=',' decimal='.'>GBP</option>
                    <option value="HKD" symbol="HK$" thousand=',' decimal='.'>HKD</option>
                    <option value="JPY" symbol="¥" thousand=',' decimal='.'>JPY</option>
                    <option value="NZD" symbol="$" thousand=',' decimal='.'>NZD</option>
                    <option value="USD" symbol="$" thousand=',' decimal='.'>USD</option>
                </select><br/>
            </div>

            <NumberFormat
                value={netWorth || 0}
                displayType="text"
                decimalScale={2}
                fixedDecimalScale={true}
                thousandSeparator={currencyFormat.thousand}
                decimalSeparator={currencyFormat.decimal}
                prefix={currencyFormat.symbol}
                renderText={(value, props) => <p>Net Worth: {value}</p>}
            />

            <hr className="solidLine"></hr>

            <table>
                <tbody><tr><th scope="row">Assets</th></tr></tbody>
                <TableGroup data={assetList.slice(0, 9)} label="Cash and Investments" format={currencyFormat} state={equity} onChange={onInputChange}/>
                <TableGroup data={assetList.slice(9, assetList.length)} label="Long Term Assets" format={currencyFormat} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Assets</th>
                        <td className="mid">{currencyFormat.symbol}</td>
                        <td>
                            <NumberFormat
                                className="right"
                                value={totalAssets || 0}
                                displayType="input"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={currencyFormat.thousand}
                                decimalSeparator={currencyFormat.decimal}
                                readOnly="readOnly"
                            />
                        </td>
                    </tr>
                    <tr className="break"><td/></tr>
                </tbody>

                <tbody><tr><th scope="row">Liabilities</th></tr></tbody>
                <TableGroup data={liabilitiesList.slice(0,2)} label="Short Term Liabilities" format={currencyFormat} state={equity} onChange={onInputChange}/>
                <TableGroup data={liabilitiesList.slice(2,liabilitiesList.length)} label="Long Term Debt" format={currencyFormat} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Liabilities</th>
                        <td className="mid">{currencyFormat.symbol}</td>
                        <td>
                            <NumberFormat
                                className="right"
                                value={totalLiabilities || 0}
                                displayType="input"
                                decimalScale={2}
                                fixedDecimalScale={true}
                                thousandSeparator={currencyFormat.thousand}
                                decimalSeparator={currencyFormat.decimal}
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
import TableGroup from './TableGroup'
import { useState, useEffect } from 'react'

const Content = () => {
    const [equity, setEquity] = useState({});
    const [baseCurrency, setBaseCurrency] = useState("CAD");
    const [currencySymbol, setCurrencySymbol] = useState('$');
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
        console.log("handleCurrencyChange detected");
        const newCurrency = event.target.value;
        setCurrencySymbol(event.target.selectedOptions[0].getAttribute('symbol'));
        setBaseCurrency(newCurrency);
        calculateEquity(equity, baseCurrency, newCurrency);
    }

    const onInputChange = (event) => {
        console.log("handleInputChange detected");
        const id = event.target.id;
        const value = event.target.value;
        const newEquity = {
            ...equity,
            [id]: value
        }
        setEquity(newEquity);
        calculateEquity(newEquity);
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
                setBaseCurrency(data.baseCurrencyCode);
                setNetWorth(data.totalNetWorth);
            })
        .catch(console.log);
    }

    return (
        <div className="Content">
            <label htmlFor="currency">Select Currency: </label>
            <select name="currency" id="currency" defaultValue={baseCurrency} onChange={onCurrencyChange}>
                <option value="AUD" symbol="$">AUD</option>
                <option value="CAD" symbol="$">CAD</option>
                <option value="CHF" symbol="₣">CHF</option>
                <option value="CNY" symbol="¥">CNY</option>
                <option value="EUR" symbol="€">EUR</option>
                <option value="GBP" symbol="£">GBP</option>
                <option value="HKD" symbol="$">HKD</option>
                <option value="JPY" symbol="¥">JPY</option>
                <option value="NZD" symbol="$">NZD</option>
                <option value="USD" symbol="$">USD</option>
            </select><br/>
            <p>Net Worth: {currencySymbol} {netWorth}</p>
            <hr className="solidLine"></hr>

            <table>
                <tbody><tr><th scope="row">Assets</th></tr></tbody>
                <TableGroup data={assetList.slice(0, 9)} label="Cash and Investments" symbol={currencySymbol} state={equity} onChange={onInputChange}/>
                <TableGroup data={assetList.slice(9, assetList.length)} label="Long Term Assets" symbol={currencySymbol} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Assets</th>
                        <td>{currencySymbol}<input type="number" readOnly="readOnly" id="totalAssets" value={totalAssets}/></td>
                    </tr>
                    <tr className="break"><td/></tr>
                </tbody>

                <tbody><tr><th scope="row">Liabilities</th></tr></tbody>
                <TableGroup data={liabilitiesList.slice(0,2)} label="Short Term Liabilities" symbol={currencySymbol} state={equity} onChange={onInputChange}/>
                <TableGroup data={liabilitiesList.slice(2,liabilitiesList.length)} label="Long Term Debt" symbol={currencySymbol} state={equity} onChange={onInputChange}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Liabilities</th>
                        <td>{currencySymbol}<input type="number" readOnly="readOnly" id="totalLiabilities" value={totalLiabilities}/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default Content;
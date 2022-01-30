import TableGroup from './TableGroup'

const Content = () => {
    const currencySymbol = '$';

    const assets = [
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
    const liabilities = [
        {label: 'Credit Card 1', id: 'creditCard1'},
        {label: 'Credit Card 2', id: 'creditCard2'},
        {label: 'Mortgage 1', id: 'mortgage1'},
        {label: 'Mortgage 2', id: 'mortgage2'},
        {label: 'Line of Credit', id: 'lineOfCredit'},
        {label: 'Investment Loan', id: 'investmentLoan'},
    ];


    return (
        <div className="Content">
            <label htmlFor="currency">Select Currency: </label>
            <select name="currency" id="currency">
                <option value="AUD">AUD</option>
                <option value="CAD">CAD</option>
                <option value="CHF">CHF</option>
                <option value="CNH">CNH</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="HKD">HKD</option>
                <option value="JPY">JPY</option>
                <option value="USD">NZD</option>
                <option value="USD">USD</option>
            </select><br/>
            <p>Net Worth: </p>
            <hr className="solidLine"></hr>
            <h4>Assets</h4>

            <table className="table">
                <TableGroup data={assets.slice(0, 9)} label="Cash and Investments" symbol={currencySymbol}/>
                <TableGroup data={assets.slice(9, assets.length)} label="Long Term Assets" symbol={currencySymbol}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Assets</th>
                        <td>{currencySymbol}<input type="number" readOnly="readOnly" id="totalAssets" defaultValue="0.00"/></td>
                    </tr>
                    <tr className="break"><td/></tr>
                </tbody>
                <TableGroup data={liabilities.slice(0,2)} label="Short Term Liabilities" symbol={currencySymbol}/>
                <TableGroup data={liabilities.slice(2,assets.length)} label="Long Term Debt" symbol={currencySymbol}/>
                <tbody>
                    <tr>
                        <th scope="row">Total Liabilities</th>
                        <td>{currencySymbol}<input type="number" readOnly="readOnly" id="totalLiabilities" defaultValue="0.00"/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default Content;
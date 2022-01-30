const Content = () => {
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
                <tbody>
                    <tr><th>Cash and Investments</th></tr>
                    <tr key="chequing">
                        <td>Chequing</td>
                        <td>$</td>
                        <td className="right"><input type="number" id="chequing" defaultValue="0.00"/></td>
                    </tr>
                    <tr key="taxSavings">
                        <td>Savings for Taxes</td>
                        <td>$</td>
                        <td className="right"><input type="number" id="taxSavings" defaultValue="0.00"/></td>
                    </tr>
                </tbody>

                <tbody>
                    <tr><th>Liabilities</th></tr>
                    <tr key="creditCard1">
                        <td>Credit Card 1</td>
                        <td>$</td>
                        <td className="right"><input type="number" id="creditCard1" defaultValue="0.00"/></td>
                    </tr>
                    <tr key="creditCard2">
                        <td>Credit Card 2</td>
                        <td>$</td>
                        <td className="right"><input type="number" id="creditCard2" defaultValue="0.00"/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
 
export default Content;
import NumberFormat from "react-number-format";

const TableGroup = (props) => {
    return (
        <tbody>
            <tr><th>{props.label}</th></tr>
            {props.data.map((element) => (
                <tr key={element.id}>
                    <td>{element.label}</td>
                    <td className="mid">{props.format.symbol}</td>
                    <td className="right">
                        <NumberFormat
                            id={element.id}
                            value={props.state[element.id] || 0}
                            displayType="input"
                            type="text"
                            allowNegative={false}
                            thousandSeparator={props.format.thousand}
                            decimalSeparator={props.format.decimal}
                            decimalScale={2}
                            fixedDecimalScale={true}
                            onValueChange={props.onChange}
                        />
                    </td>
                </tr>
            ))}
        </tbody>
    );
}

export default TableGroup;
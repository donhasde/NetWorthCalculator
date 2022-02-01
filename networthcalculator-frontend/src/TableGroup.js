const TableGroup = (props) => {
    return (
        <tbody>
            <tr><th>{props.label}</th></tr>
            {props.data.map((element) => (
                <tr key={element.id}>
                    <td>{element.label}</td>
                    <td className="right">{props.symbol}<input type="number" id={element.id} value={props.state[element.id] || ''} onChange={props.onChange}/></td>
                </tr>
            ))}
        </tbody>
    );
}

export default TableGroup;
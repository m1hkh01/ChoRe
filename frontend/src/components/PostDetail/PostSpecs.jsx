function PostSpecs({ specs }) {
    if (!specs || specs.length === 0) return null;

    return (
        <div className="mb-4">
            <h6>Thông số kỹ thuật</h6>
            <table className="table table-sm">
                <tbody>
                    {specs.map((s, i) => (
                        <tr key={i}>
                            <td width="40%" className="fw-semibold">
                                {s.specName}
                            </td>
                            <td>{s.value}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PostSpecs;

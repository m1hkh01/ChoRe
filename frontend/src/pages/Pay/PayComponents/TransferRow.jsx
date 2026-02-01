export default function TransferRow({ label, value }) {
    return (
        <div className="border-b-2 border-gray-200 pb-1">
            <p className="uppercase text-xs font-semibold text-gray-600">
                {label}
            </p>
            <p className="text-base">{value}</p>
        </div>
    );
}

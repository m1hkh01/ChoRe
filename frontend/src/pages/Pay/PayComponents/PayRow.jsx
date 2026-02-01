export default function PayRow({ label, value, highlight }) {
    return (
        <div className="border-b border-gray-400 py-1">
            <p className="uppercase font-semibold text-gray-600 text-xs">
                {label}
            </p>
            <p className={`text-base ${highlight ? "text-yellow-600" : ""}`}>
                {value}
            </p>
        </div>
    );
}

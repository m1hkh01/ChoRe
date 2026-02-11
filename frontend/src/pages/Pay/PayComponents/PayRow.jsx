export default function PayRow({ label, value, full }) {
    return (
        <div className={`py-1 ${full ? 'w-full' : "w-30"}`} >
            <p className="uppercase font-semibold text-gray-600 text-left text-xs mb-1">
                {label}
            </p>
            <p className={`text-base mb-1`}>
                {value}
            </p>
        </div>
    );
}

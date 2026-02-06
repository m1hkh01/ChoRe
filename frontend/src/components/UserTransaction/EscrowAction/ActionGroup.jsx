export function ActionGroup({ primary, secondary }) {
    return (
        <div className="flex gap-3">
            {primary && (
                <button className="px-4 py-2 bg-green-600 text-white !rounded-xl hover:bg-green-700 transition">
                    {primary}
                </button>
            )}
            {secondary && (
                <button className="px-4 py-2 border border-red-400 text-red-500 !rounded-xl hover:bg-red-50 transition">
                    {secondary}
                </button>
            )}
        </div>
    );
}

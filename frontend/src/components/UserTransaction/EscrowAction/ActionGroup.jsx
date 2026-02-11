export function ActionGroup({
    primary,
    secondary,
    primaryDisabled = false,
    extra,
    onPrimary,
    onSecondary }
) {
    return (
        <div className="flex flex-wrap gap-3">
            {extra}
            {primary && (
                <button
                    onClick={onPrimary}
                    disabled={primaryDisabled}
                    className={`px-4 py-2 
                        ${primaryDisabled ? 'bg-gray-200 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700'}
                        !rounded-xl  transition w-max`}>
                    {primary}
                </button>
            )}
            {secondary && (
                <button onClick={onSecondary} className="px-4 py-2 w-max border border-red-400 text-red-500 !rounded-xl hover:bg-red-50 transition">
                    {secondary}
                </button>
            )}
        </div>
    );
}

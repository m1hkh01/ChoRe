export function TagSelector({ tags, selectedTags, onToggle }) {
    return (
        <div className="flex flex-wrap gap-2.5 mb-3">
            {tags?.map((tag) => {
                const selectedSet = new Set(selectedTags?.map(t => t.tag));
                const isSelected = selectedSet.has(tag);
                return (
                    <button
                        key={tag}
                        type="button"
                        onClick={() => onToggle(tag)}
                        className={`
              rounded-full! px-4 py-2 text-sm font-medium transition-all
              ${isSelected
                                ? 'bg-green-600 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:scale-95'
                            }
            `}
                    >
                        {tag}
                    </button>
                );
            })}
        </div>
    );
}
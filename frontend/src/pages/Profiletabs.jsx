// ─── ProfileTabs.jsx ─────────────────────────────────────────────────────────
export function ProfileTabs({ tabs, activeTab, onChange }) {
    return (
        <div className="profile-tabs">
            <div className="tabs-nav">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? "active" : ""}`}
                        onClick={() => onChange(tab.key)}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        <span className="tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ProfileTabs;
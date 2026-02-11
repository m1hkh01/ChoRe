export default function SwitchItem({ children, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`z-10 w-1/2 text-center font-semibold cursor-pointer 
                ${active ? "" : "text-gray-500"}`}
        >
            {children}
        </div>
    );
}

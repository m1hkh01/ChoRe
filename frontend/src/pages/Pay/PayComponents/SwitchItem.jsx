export default function SwitchItem({ children, active, onClick }) {
    return (
        <div
            onClick={onClick}
            className={`z-10 w-[130px] text-center font-semibold cursor-pointer 
                ${active ? "" : "text-gray-500"}`}
        >
            {children}
        </div>
    );
}

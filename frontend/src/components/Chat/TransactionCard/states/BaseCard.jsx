export default function BaseCard({ title, children, footer }) {
    return (
        <div className="rounded-lg w-full max-w-md mx-auto mt-3 bg-white border shadow-sm p-4">
            <div className="text-center font-semibold text-lg mb-3">{title}</div>
            {children}
            {footer && <div className="mt-3 text-center text-sm text-gray-600">{footer}</div>}
        </div>
    );
}
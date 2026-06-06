import React from "react";

export default function StatCard({ 
    title, 
    value, 
    description,
    icon
}: { 
    title: string; 
    value: string | number; 
    description?: string;
    icon?: React.ReactNode;
}) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
                </div>
                {icon && (
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        {icon}
                    </div>
                )}
            </div>
            {description && (
                <p className="text-xs text-gray-400 mt-4 font-medium">{description}</p>
            )}
        </div>
    );
}

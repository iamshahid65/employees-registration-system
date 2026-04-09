import React, { memo } from 'react';
import { Mail, MapPin, Phone, Briefcase, Building2, DollarSign, Calendar, Edit2, Trash2 } from 'lucide-react';

export const EmployeeCard = memo(({ employee, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatSalary = (salary) => {
        if (!salary) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
        }).format(salary);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-primary-200 transition-all duration-300 overflow-hidden group">
            {/* Header */}
            <div className="p-5 border-b border-gray-50">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-lg">
                            {employee.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">{employee.name}</h3>
                            <p className="text-sm text-gray-500">{employee.email}</p>
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        employee.status === 'active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                    }`}>
                        {employee.status}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                    <Briefcase className="w-4 h-4 text-primary-500" />
                    <span className="text-gray-600">{employee.designation}</span>
                </div>

                {employee.department && (
                    <div className="flex items-center gap-3 text-sm">
                        <Building2 className="w-4 h-4 text-primary-500" />
                        <span className="text-gray-600">{employee.department}</span>
                    </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    <span className="text-gray-600 truncate">{employee.address}</span>
                </div>

                {employee.phone && (
                    <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-primary-500" />
                        <span className="text-gray-600">{employee.phone}</span>
                    </div>
                )}

                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-50">
                    {employee.salary && (
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="w-4 h-4 text-green-500" />
                            <span className="font-semibold text-gray-700">{formatSalary(employee.salary)}</span>
                        </div>
                    )}
                    {employee.joining_date && (
                        <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-blue-500" />
                            <span className="text-gray-600">{formatDate(employee.joining_date)}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="px-5 py-3 bg-gray-50 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={() => onEdit(employee)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-primary-600 bg-white border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
                >
                    <Edit2 className="w-4 h-4" />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(employee)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Delete
                </button>
            </div>
        </div>
    );
});

EmployeeCard.displayName = 'EmployeeCard';

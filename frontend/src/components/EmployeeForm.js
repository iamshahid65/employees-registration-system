import React, { useState, useEffect, useCallback } from 'react';
import { User, Mail, Briefcase, MapPin, Phone, Building2, DollarSign, Calendar } from 'lucide-react';

const initialFormData = {
    name: '',
    email: '',
    designation: '',
    address: '',
    phone: '',
    department: '',
    salary: '',
    joiningDate: '',
    status: 'active'
};

export const EmployeeForm = ({ employee, onSubmit, onCancel, departments = [] }) => {
    const [formData, setFormData] = useState(initialFormData);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (employee) {
            setFormData({
                name: employee.name || '',
                email: employee.email || '',
                designation: employee.designation || '',
                address: employee.address || '',
                phone: employee.phone || '',
                department: employee.department || '',
                salary: employee.salary || '',
                joiningDate: employee.joining_date ? employee.joining_date.split('T')[0] : '',
                status: employee.status || 'active'
            });
        } else {
            setFormData(initialFormData);
        }
        setErrors({});
    }, [employee]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!formData.name.trim() || formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.designation.trim()) {
            newErrors.designation = 'Designation is required';
        }

        if (!formData.address.trim() || formData.address.length < 5) {
            newErrors.address = 'Address must be at least 5 characters';
        }

        if (formData.phone && !/^[+]?[\d\s-()]{10,20}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid phone number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    }, [errors]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = (fieldName) => `
        w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-primary-500 
        focus:border-primary-500 outline-none transition-all duration-200
        ${errors[fieldName] ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-gray-300'}
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Name */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <User className="w-4 h-4 text-primary-500" />
                        Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={inputClasses('name')}
                        placeholder="John Doe"
                    />
                    {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Mail className="w-4 h-4 text-primary-500" />
                        Email <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={inputClasses('email')}
                        placeholder="john@example.com"
                    />
                    {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                </div>

                {/* Designation */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Briefcase className="w-4 h-4 text-primary-500" />
                        Designation <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleChange}
                        className={inputClasses('designation')}
                        placeholder="Software Engineer"
                    />
                    {errors.designation && <p className="text-xs text-red-500">{errors.designation}</p>}
                </div>

                {/* Department */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Building2 className="w-4 h-4 text-primary-500" />
                        Department
                    </label>
                    <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={inputClasses('department')}
                    >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Sales">Sales</option>
                        <option value="HR">HR</option>
                        <option value="Finance">Finance</option>
                        <option value="Operations">Operations</option>
                    </select>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Phone className="w-4 h-4 text-primary-500" />
                        Phone
                    </label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={inputClasses('phone')}
                        placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                </div>

                {/* Salary */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <DollarSign className="w-4 h-4 text-primary-500" />
                        Salary
                    </label>
                    <input
                        type="number"
                        name="salary"
                        value={formData.salary}
                        onChange={handleChange}
                        className={inputClasses('salary')}
                        placeholder="50000"
                        min="0"
                        step="1000"
                    />
                </div>

                {/* Joining Date */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary-500" />
                        Joining Date
                    </label>
                    <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                        className={inputClasses('joiningDate')}
                    />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className={inputClasses('status')}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Address */}
            <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-primary-500" />
                    Address <span className="text-red-500">*</span>
                </label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`${inputClasses('address')} resize-none`}
                    placeholder="123 Main St, City, Country"
                />
                {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </>
                    ) : (
                        employee ? 'Update Employee' : 'Add Employee'
                    )}
                </button>
            </div>
        </form>
    );
};

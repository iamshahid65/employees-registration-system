import React, { useState, useCallback, useMemo } from 'react';
import { Plus, Users, UserCheck, UserX, Building2, Loader2 } from 'lucide-react';
import { EmployeeList } from '../components/EmployeeList';
import { EmployeeForm } from '../components/EmployeeForm';
import { Modal } from '../components/Modal';
import { Toast } from '../components/Toast';
import { employeeApi } from '../services/api';
import { useEmployeeStats, useDepartments } from '../hooks/useEmployees';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
                {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                    <p className={`text-3xl font-bold ${color}`}>{value || 0}</p>
                )}
            </div>
            <div className={`p-3 rounded-xl ${color.replace('text-', 'bg-').replace('600', '100')}`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
        </div>
    </div>
);

export const Dashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [toast, setToast] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const { stats, loading: statsLoading } = useEmployeeStats();
    const { departments } = useDepartments();

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    const handleAdd = useCallback(() => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    }, []);

    const handleEdit = useCallback((employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setSelectedEmployee(null);
    }, []);

    const handleSubmit = useCallback(async (formData) => {
        try {
            if (selectedEmployee) {
                await employeeApi.update(selectedEmployee.id, formData);
                showToast('Employee updated successfully');
            } else {
                await employeeApi.create(formData);
                showToast('Employee created successfully');
            }
            handleCloseModal();
            setRefreshKey(prev => prev + 1); // Trigger refresh
        } catch (error) {
            showToast(error.message || 'Something went wrong', 'error');
            throw error;
        }
    }, [selectedEmployee, showToast, handleCloseModal]);

    const handleDelete = useCallback(async (employee) => {
        if (!window.confirm(`Are you sure you want to delete ${employee.name}?`)) {
            return;
        }

        try {
            await employeeApi.delete(employee.id);
            showToast('Employee deleted successfully');
            setRefreshKey(prev => prev + 1);
        } catch (error) {
            showToast(error.message || 'Failed to delete employee', 'error');
        }
    }, [showToast]);

    const statsData = useMemo(() => [
        { icon: Users, label: 'Total Employees', value: stats?.total, color: 'text-blue-600' },
        { icon: UserCheck, label: 'Active Employees', value: stats?.active, color: 'text-green-600' },
        { icon: UserX, label: 'Inactive Employees', value: stats?.inactive, color: 'text-red-600' },
        { icon: Building2, label: 'Departments', value: stats?.total_departments, color: 'text-purple-600' },
    ], [stats]);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900">Employee Registration</h1>
                                <p className="text-xs text-gray-500">Manage your team efficiently</p>
                            </div>
                        </div>
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-primary-500/30"
                        >
                            <Plus className="w-5 h-5" />
                            Add Employee
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsData.map((stat, index) => (
                        <StatCard key={index} {...stat} loading={statsLoading} />
                    ))}
                </div>

                {/* Employee List */}
                <EmployeeList 
                    key={refreshKey}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </main>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                size="lg"
            >
                <EmployeeForm
                    employee={selectedEmployee}
                    onSubmit={handleSubmit}
                    onCancel={handleCloseModal}
                    departments={departments}
                />
            </Modal>

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
};

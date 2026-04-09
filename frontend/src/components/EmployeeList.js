import React, { useState, useCallback, useMemo } from 'react';
import { Search, Filter, Users, Grid, List, X } from 'lucide-react';
import { EmployeeCard } from './EmployeeCard';
import { useEmployees, useDepartments } from '../hooks/useEmployees';

export const EmployeeList = ({ onEdit, onDelete }) => {
    const [viewMode, setViewMode] = useState('grid');
    const [filters, setFilters] = useState({
        search: '',
        department: '',
        status: ''
    });

    const { employees, loading, error, refetch } = useEmployees(filters);
    console.log("Employees Data",employees)
    const { departments } = useDepartments();

    const handleFilterChange = useCallback((key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    }, []);

    const clearFilters = useCallback(() => {
        setFilters({ search: '', department: '', status: '' });
    }, []);

    const hasActiveFilters = useMemo(() => 
        filters.search || filters.department || filters.status,
        [filters]
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
                    <p className="text-gray-500">Loading employees...</p>
                </div>
            </div>
        );
    }

    // if (error) {
    //     return (
    //         <div className="flex flex-col items-center justify-center h-64 text-center">
    //             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
    //                 <Users className="w-8 h-8 text-red-500" />
    //             </div>
    //             <h3 className="text-lg font-semibold text-gray-800 mb-2">Failed to load employees</h3>
    //             <p className="text-gray-500 mb-4">{error}</p>
    //             <button 
    //                 onClick={refetch}
    //                 className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
    //             >
    //                 Try Again
    //             </button>
    //         </div>
    //     );
    // }

    return (
        <div className="space-y-6">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                {/* Search */}
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name, email, or designation..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                    />
                    {filters.search && (
                        <button
                            onClick={() => handleFilterChange('search', '')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                    <select
                        value={filters.department}
                        onChange={(e) => handleFilterChange('department', e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white text-sm"
                    >
                        <option value="">All Departments</option>
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </select>

                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
                        >
                            <Filter className="w-4 h-4" />
                            Clear
                        </button>
                    )}

                    {/* View Toggle */}
                    <div className="flex items-center bg-gray-100 rounded-xl p-1 ml-auto">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between">
                <p className="text-gray-600">
                    Showing <span className="font-semibold text-gray-800">{employees.length}</span> employees
                </p>
            </div>

            {/* Employee Grid/List */}
            {employees.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No employees found</h3>
                    <p className="text-gray-500 max-w-sm">
                        {hasActiveFilters 
                            ? 'Try adjusting your search or filters to find what you\'re looking for.'
                            : 'Get started by adding your first employee to the system.'
                        }
                    </p>
                </div>
            ) : (
                <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }>
                    {employees.map(employee => (
                        <EmployeeCard
                            key={employee.id}
                            employee={employee}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

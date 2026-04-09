import { useState, useEffect, useCallback, useRef } from 'react';
import { employeeApi } from '../services/api';

export const useEmployees = (filters = {}) => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);

    const fetchEmployees = useCallback(async () => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        try {
            const response = await employeeApi.getAll(
                filters, 
                abortControllerRef.current.signal
            );

            // Check if component is still mounted (signal not aborted)
            if (!abortControllerRef.current.signal.aborted) {
                setEmployees(response.data || []);
            }
        } catch (err) {
            // Don't update state if request was aborted
            if (err.name === 'AbortError' || err.name === 'CanceledError') {
                console.log('Request cancelled');
                return;
            }

            if (!abortControllerRef.current?.signal.aborted) {
                setError(err.message || 'Failed to fetch employees');
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, [filters.status, filters.department, filters.search]);

    useEffect(() => {
        fetchEmployees();

        // Cleanup: abort any pending request on unmount or dependency change
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchEmployees]);

    const refetch = useCallback(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    return { employees, loading, error, refetch };
};

export const useEmployeeStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const abortControllerRef = useRef(null);

    const fetchStats = useCallback(async () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();
        setLoading(true);

        try {
            const response = await employeeApi.getStats(abortControllerRef.current.signal);
            if (!abortControllerRef.current.signal.aborted) {
                setStats(response.data);
            }
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Failed to fetch stats:', err);
            }
        } finally {
            if (!abortControllerRef.current?.signal.aborted) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        fetchStats();
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchStats]);

    return { stats, loading, refetch: fetchStats };
};

export const useDepartments = () => {
    const [departments, setDepartments] = useState([]);
    const abortControllerRef = useRef(null);

    useEffect(() => {
        const fetchDepartments = async () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            abortControllerRef.current = new AbortController();

            try {
                const response = await employeeApi.getDepartments(abortControllerRef.current.signal);
                if (!abortControllerRef.current.signal.aborted) {
                    setDepartments(response.data || []);
                }
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Failed to fetch departments:', err);
                }
            }
        };

        fetchDepartments();

        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    return { departments };
};

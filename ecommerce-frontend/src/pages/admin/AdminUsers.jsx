import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AdminLayout from '../../components/admin/AdminLayout';
import adminService from '../../services/adminService';

/**
 * Admin Users Page
 * List and manage all users
 */
const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    useEffect(() => {
        fetchUsers();
    }, [roleFilter]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {};
            if (roleFilter !== 'all') params.role = roleFilter;
            const response = await adminService.getUsers(params);
            setUsers(response.data || []);
        } catch (error) {
            console.error('Failed to fetch users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleToggleAdmin = async (userId) => {
        if (!confirm('Are you sure you want to change this user\'s admin status?')) return;
        try {
            await adminService.toggleUserAdmin(userId);
            fetchUsers();
        } catch (error) {
            console.error('Failed to toggle admin:', error);
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold text-white">Users</h1>
                    <p className="text-neutral-400">Manage customer accounts</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="all">All Users</option>
                        <option value="admin">Admins</option>
                        <option value="customer">Customers</option>
                    </select>
                </div>

                {/* Users Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-800 rounded-xl overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-neutral-700/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">User</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-400 uppercase">Joined</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-400 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-700">
                                {loading ? (
                                    [...Array(5)].map((_, i) => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-32" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-40" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-16" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20" /></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-neutral-700 rounded w-20 ml-auto" /></td>
                                        </tr>
                                    ))
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-neutral-700/30">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                                                        <span className="text-sm font-bold text-white">
                                                            {user.name?.charAt(0)?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="text-white font-medium">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-300">{user.email}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 text-xs font-medium rounded ${user.is_admin ? 'bg-purple-500/20 text-purple-400' : 'bg-neutral-600/20 text-neutral-400'}`}>
                                                    {user.is_admin ? 'Admin' : 'Customer'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-neutral-400 text-sm">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleToggleAdmin(user.id)}
                                                        className={`px-3 py-1 text-xs rounded ${user.is_admin ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'}`}
                                                    >
                                                        {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                                            No users found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </AdminLayout>
    );
};

export default AdminUsers;

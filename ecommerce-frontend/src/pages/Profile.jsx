import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import PageTransition from '../components/common/PageTransition';
import Button from '../components/common/Button';

/**
 * Profile Page - User settings and account info
 */
const Profile = () => {
    const { user, logout } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
    });

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsEditing(false);
    };

    return (
        <PageTransition>
            <DashboardLayout>
                <div className="space-y-6">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        <div className="px-6 py-5 border-b border-neutral-200">
                            <h1 className="text-2xl font-serif font-medium text-neutral-900">Profile Settings</h1>
                            <p className="text-neutral-500 mt-1">Manage your account information</p>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
                                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
                                    <span className="text-3xl font-medium text-primary-600">{user?.name?.charAt(0)?.toUpperCase() || 'U'}</span>
                                </div>
                                <div>
                                    <h2 className="text-xl font-medium text-neutral-900">{user?.name}</h2>
                                    <p className="text-neutral-500">{user?.email}</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="grid sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${!isEditing ? 'bg-neutral-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-neutral-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 ${!isEditing ? 'bg-neutral-50 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-4">
                                    {isEditing ? (
                                        <>
                                            <Button type="submit" variant="primary">Save Changes</Button>
                                            <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        </>
                                    ) : (
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-sm p-6 border border-red-100">
                        <h2 className="text-lg font-medium text-red-600 mb-4">Danger Zone</h2>
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-medium text-neutral-900">Sign Out</h3>
                                <p className="text-sm text-neutral-500">Sign out of your account</p>
                            </div>
                            <Button variant="outline" onClick={logout} className="!border-red-200 !text-red-600 hover:!bg-red-50">Sign Out</Button>
                        </div>
                    </motion.div>
                </div>
            </DashboardLayout>
        </PageTransition>
    );
};

export default Profile;

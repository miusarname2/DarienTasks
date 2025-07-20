import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Activity, DollarSign, Settings, Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 overflow-x-auto">
                <main className="flex-1 p-6 overflow-y-auto">
                    <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Dashboard</h1>
                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-blue-500" />
                                    <span className="text-lg font-medium">Users</span>
                                </div>
                                <span className="text-2xl font-bold">1.2K</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">+5% since last week</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <DollarSign className="mr-2 h-5 w-5 text-green-500" />
                                    <span className="text-lg font-medium">Sales</span>
                                </div>
                                <span className="text-2xl font-bold">$34.4K</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">+12% since last week</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Activity className="mr-2 h-5 w-5 text-purple-500" />
                                    <span className="text-lg font-medium">Visit</span>
                                </div>
                                <span className="text-2xl font-bold">8.7K</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">+8% since last week</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Settings className="mr-2 h-5 w-5 text-yellow-500" />
                                    <span className="text-lg font-medium">Adjustments</span>
                                </div>
                                <span className="text-2xl font-bold">12</span>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500">Configurable elements</p>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </AppLayout>
    );
}

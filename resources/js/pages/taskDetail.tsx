import AppLayout from "@/layouts/app-layout";
import React, { useState, useEffect } from 'react'; // Importa useState y useEffect
import { BreadcrumbItem } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Edit } from "lucide-react";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
    due_date: string;
    created_at: string;
    updated_at: string;
}


const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' },
    { title: 'Detail', href: '' }
];

export default function TaskDetail() {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            setError(null);

            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get('task');

            if (!taskId || isNaN(Number(taskId))) {
                setError('ID de tarea no válido en la URL.');
                setLoading(false);
                return;
            }

            try {
                const authToken = localStorage.getItem('token');

                const response = await fetch(`http://localhost:8000/api/tasks/${taskId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Tarea no encontrada.');
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                const data: Task = await response.json();
                setTask(data);
            } catch (err: any) {
                setError(err.message || 'Error al cargar la tarea.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, []);

    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading task..." />
                <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow text-center">
                    <p className="text-gray-700 dark:text-gray-300">Loading task details...</p>
                </div>
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Error" />
                <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow text-center">
                    <p className="text-red-600 dark:text-red-400">Error: {error}</p>
                    <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:underline">Back to task list</Link>
                </div>
            </AppLayout>
        );
    }

    if (!task) {
        // Esto podría pasar si loading y error son false, pero task sigue siendo null (ej. 404 manejado)
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Task Not Found" />
                <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow text-center">
                    <p className="text-gray-700 dark:text-gray-300">The task could not be loaded or does not exist.</p>
                    <Link href="/tasks" className="mt-4 inline-block text-blue-600 hover:underline">Back to task list</Link>
                </div>
            </AppLayout>
        );
    }

    // Si todo está bien, renderiza los detalles de la tarea
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tarea: ${task.title}`} />
            <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Detail</h1>
                    <Link
                        href={`/tasks/edit?task=${task.id}`}
                        className="inline-flex items-center gap-2 py-1 px-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
                    >
                        <Edit size={16} /> Edit
                    </Link>
                </div>

                <div className="space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Title</h2>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{task.title}</p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</h2>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{task.description}</p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Expiry date</h2>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{task.due_date}</p>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">State</h2>
                        <span
                            className={`inline-block py-1 px-3 rounded-full text-xs font-medium ${task.completed
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}
                        >
                            {task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

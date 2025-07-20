import AppLayout from "@/layouts/app-layout";
import React from 'react';
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
}

export interface TaskDetailProps {
    task: Task;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' },
    { title: 'Detalle', href: '' }
];

export default function TaskDetail({ task }: TaskDetailProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Tarea: ${task.title}`} />
            <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Detail</h1>
                    <Link
                        href={`/tasks/edit/${task.id}`}
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
                            className={`inline-block py-1 px-3 rounded-full text-xs font-medium $
                task.completed
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              `}
                        >
                            {task.completed ? 'Completed' : 'Pending'}
                        </span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

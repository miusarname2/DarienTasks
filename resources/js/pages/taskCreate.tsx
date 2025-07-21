import AppLayout from "@/layouts/app-layout";
import React, { useState, FormEvent } from 'react';
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' },
    { title: 'Create', href: '/tasks/create' }
];

export default function TaskCreate() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');

    const submitForm = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const id = localStorage.getItem('eid');
            const response = await fetch(`${window.location.origin}/api/tasks`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    completed: false,
                    user_id: id,
                    due_date: dueDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error creando la tarea');
            }

            const newTask = await response.json();
            console.log('Tarea creada:', newTask);
            router.visit('/tasks'); // si quieres usar Inertia para refrescar
        } catch (error: any) {
            console.error(error.message);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Task" />

            <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">New Task</h2>
                <form onSubmit={submitForm} className="space-y-4 h-full">
                    <div>
                        <Label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Title
                        </Label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Enter the title"
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div className="flex-grow">
                        <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </Label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Task details"
                            className="mt-1 w-full h-32 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div>
                        <Label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Expiry date
                        </Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={dueDate}
                            onChange={e => setDueDate(e.target.value)}
                            className="mt-1 w-full bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 dark:text-gray-100"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit">Create Task</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

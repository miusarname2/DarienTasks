import AppLayout from "@/layouts/app-layout";
import React, { useState, useEffect, useMemo } from 'react';
import { BreadcrumbItem } from "@/types";
import { motion } from 'framer-motion';
import { Head, Link, router } from "@inertiajs/react";
import { CheckCircle, Circle, Edit, Plus, Trash2 } from "lucide-react";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' }
];

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
    due_date: string;
}

export default function Tasks() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [statusFilter, setStatusFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        setLoading(true);
        setError(null);

        fetch('http://localhost:8000/api/tasks', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                // inyectamos el Bearer token
                'Authorization': `Bearer ${token}`
            },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then((data: Task[]) => {
                setTasks(data);
            })
            .catch(err => {
                console.error(err);
                setError('No se pudieron cargar las tareas.');
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);


    const filtered = useMemo(() =>
        tasks.filter(task => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
            const matchesStatus =
                statusFilter === 'all' ||
                (statusFilter === 'completed' && task.completed) ||
                (statusFilter === 'pending' && !task.completed);
            return matchesSearch && matchesStatus;
        })
        , [tasks, search, statusFilter]);

    const toggle = async (id: number) => {
        // 1. Sacar el token
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No hay token en localStorage');
            return;
        }

        // 2. Encontrar la tarea actual
        const task = tasks.find(t => t.id === id);
        if (!task) {
            console.error(`Tarea con id ${id} no encontrada`);
            return;
        }

        // 3. Nuevo estado completado (true ⇄ false)
        const newCompleted = !task.completed;

        try {
            // 4. Llamada al API
            const res = await fetch(`http://localhost:8000/api/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ completed: newCompleted })
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // 5. Actualizar estado local para reflejar el cambio
            setTasks(prev =>
                prev.map(t =>
                    t.id === id
                        ? { ...t, completed: newCompleted }
                        : t
                )
            );

        } catch (err) {
            console.error('Error al actualizar tarea:', err);
            setError?.('No se pudo actualizar el estado de la tarea.');
        }
    };

    const confirmRemove = (id: number) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const remove = async () => {
        if (selectedId == null) return;

        const token = localStorage.getItem('token');
        setLoading(true);
        setError(null);

        try {
            const res = await fetch(`http://localhost:8000/api/tasks/${selectedId}`, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error(`HTTP ${res.status}`);
            }

            // Opcional: actualizar el estado local para quitar la tarea eliminada
            setTasks(prev => prev.filter(task => task.id !== selectedId));
            setShowModal(false);

        } catch (err) {
            console.error(err);
            setError('No se pudo eliminar la tarea.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex flex-col gap-6 p-6">
                <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Tasks</h1>
                    <Link href="/tasks/create" className="inline-flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700">
                        <Plus size={16} /> New Task
                    </Link>
                </header>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by title..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="flex-1 border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                    <select
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        className="border rounded-lg p-2 bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    >
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="pending">Earrings</option>
                    </select>
                </div>

                <ul className="space-y-4">
                    {filtered.map(task => (
                        <motion.li
                            key={task.id}
                            layout initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg hover:shadow-sm bg-white dark:bg-[#1a1a1a]"
                        >
                            <div className="flex items-center gap-3">
                                <button onClick={() => toggle(task.id)}>
                                    {task.completed ? <CheckCircle className="text-green-500" /> : <Circle className="text-gray-400" />}
                                </button>
                                <Link href={`/tasks/detail`} as="a" preserveScroll>
                                    <span className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'} font-medium`}>{task.title}</span>
                                </Link>
                            </div>

                            <div className="flex items-center gap-3 mt-3 md:mt-0">
                                <Link href={`/tasks/edit`} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <Edit size={18} className="text-gray-700 dark:text-gray-300" />
                                </Link>
                                <button onClick={() => confirmRemove(task.id)} className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-700">
                                    <Trash2 size={18} className="text-red-600 dark:text-red-400" />
                                </button>
                            </div>
                        </motion.li>
                    ))}
                    {filtered.length === 0 && <li className="text-center text-gray-500">There are no tasks to show.</li>}
                </ul>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white dark:bg-[#111] p-6 rounded-lg shadow-lg w-80">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Confirm deletion</h3>
                            <p className="mt-2 text-gray-700 dark:text-gray-300">Are you sure you want to eliminate this task?</p>
                            <div className="mt-4 flex justify-end gap-2">
                                <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Cancel</button>
                                <button onClick={remove} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Delete</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

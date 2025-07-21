import AppLayout from "@/layouts/app-layout";
import React, { useState, useEffect, FormEvent } from 'react'; // Importa useState, useEffect, FormEvent
import { BreadcrumbItem } from "@/types";
import { Head, router } from "@inertiajs/react";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from "lucide-react";

export interface Task {
    id: number;
    title: string;
    description: string;
    completed: boolean; // Agregado para consistencia, aunque no se use en el formulario
    user_id: number;   // Agregado para consistencia
    due_date: string;  // Asegúrate de que este es el formato correcto (YYYY-MM-DD) para input type="date"
    created_at: string;
    updated_at: string;
}

// Ya no necesitamos esta interfaz
// export interface TaskEditProps {
//     task: Task;
// }

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Tasks', href: '/tasks' },
    { title: 'Edit', href: '' }
];

// Ya no recibimos props
export default function TaskEdit() {
    // Estados para la tarea cargada y el estado de la petición
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para los campos del formulario, inicializados vacíos
    // Se llenarán una vez que la tarea sea cargada
    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [dueDate, setDueDate] = useState<string>('');

    // Efecto para cargar la tarea al montar el componente
    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            setError(null);

            // Obtener el ID de la URL usando URLSearchParams
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get('task');

            if (!taskId || isNaN(Number(taskId))) {
                setError('ID de tarea no válido en la URL (parámetro "task" ausente o inválido).');
                setLoading(false);
                return;
            }

            try {
                // Obtener el token de localStorage (como en el componente anterior)
                const authToken = localStorage.getItem('token');
                if (!authToken) {
                    throw new Error('No se encontró el token de autenticación.');
                }

                const response = await fetch(`${window.location.origin}/api/tasks/${taskId}`, {
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${authToken}`,
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('Task not found.');
                    }
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Error HTTP: ${response.status}`);
                }

                const data: Task = await response.json();
                setTask(data); // Guarda la tarea en el estado
                setTitle(data.title); // Inicializa los campos del formulario
                setDescription(data.description);
                // La fecha de vencimiento viene como "2025-07-25T00:00:00.000000Z"
                // El input type="date" espera "YYYY-MM-DD"
                setDueDate(data.due_date.split('T')[0]); // Asegura el formato correcto

            } catch (err: any) {
                setError(err.message || 'Error al cargar la tarea para edición.');
            } finally {
                setLoading(false);
            }
        };

        fetchTask();
    }, []); // El array vacío [] asegura que esto se ejecuta solo una vez al montar

    // Función de envío del formulario
    const submitForm = async (e: FormEvent) => {
        e.preventDefault();

        // Solo permite enviar si la tarea ha sido cargada
        if (!task) {
            setError('There is no task loaded to update.');
            return;
        }

        // Usa el ID de la tarea cargada
        try {
            const token = localStorage.getItem('token'); // o de donde guardes tu Bearer
            const response = await fetch(`${window.location.origin}/api/tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                    due_date: dueDate,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error actualizando la tarea');
            }

            const updatedTask = await response.json();
            console.log('Tarea actualizada:', updatedTask);
            router.visit('/tasks');
        } catch (error: any) {
            console.log(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Renderizado condicional: Carga, Error, Tarea no encontrada
    if (loading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Loading Task..." />
                <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow text-center">
                    <p className="text-gray-700 dark:text-gray-300">Loading task for editing...</p>
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
        // Esto debería ser cubierto por el error si el ID es inválido o 404,
        // pero como fallback si por alguna razón task es null aquí.
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

    // Si la tarea se cargó correctamente, renderiza el formulario
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Task: ${task.title}`} /> {/* Título dinámico */}
            <div className="flex-1 p-6 bg-white dark:bg-[#0a0a0a] rounded-lg shadow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Edit Task</h2>
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
                        <Button type="submit">Update Task</Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

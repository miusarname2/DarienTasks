import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                {/* HEADER - Login/Register */}
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-end gap-4">
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* HERO SECTION */}
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-4xl flex-col items-center justify-center">
                        <div className="rounded-lg bg-white p-6 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(26,26,0,0.16)] lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d] text-center">
                            <h1 className="mb-4 text-4xl lg:text-5xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                                Organiza tu Vida, una Tarea a la Vez.
                            </h1>
                            <p className="mb-8 text-lg text-[#706f6c] dark:text-[#A1A09A] max-w-2xl mx-auto">
                                Simplifica tu día a día y potencia tu productividad. Nuestra plataforma intuitiva te ayuda a gestionar todas tus tareas, desde proyectos complejos hasta listas de la compra. ¡Todo en un solo lugar!
                            </p>

                            <h2 className="mb-6 text-2xl font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                Características que te encantarán:
                            </h2>
                            <ul className="mb-10 flex flex-col gap-4 max-w-md mx-auto items-start text-left">
                                {[
                                    'Crea Tareas ilimitadas y organízalas por proyectos.',
                                    'Establece fechas límite y recibe recordatorios personalizables.',
                                    'Interfaz limpia y amigable, con soporte para modo oscuro.',
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-base text-[#1b1b18] dark:text-[#EDEDEC]">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#e3e3e0] bg-[#FDFDFC] shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-[#3E3E3A] dark:bg-[#161615]">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-[#28a745]">
                                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.052-.143z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <div className="flex justify-center">
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-black bg-[#1b1b18] px-8 py-3 text-base font-medium leading-normal text-white hover:border-black hover:bg-black dark:border-[#eeeeec] dark:bg-[#eeeeec] dark:text-[#1C1C1A] dark:hover:border-white dark:hover:bg-white"
                                >
                                    ¡Empieza Gratis Ahora!
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}

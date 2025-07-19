import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    title?: string;
    description?: string;
}

export default function AuthTwoColumnLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-screen bg-background">
            <div className="relative hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w1.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w2.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w3.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w3.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg col-span-2 bg-cover" style={{ backgroundImage: `url('/w2.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w1.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w4.jpg')` }} />
                    <div className="bg-slate-200 rounded-lg bg-cover" style={{ backgroundImage: `url('/w3.jpg')` }} />
                </div>
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:flex-none lg:px-20 xl:px-24">
                <div className="mx-auto w-full max-w-sm">
                    <div className="mb-8">
                        <div className="flex items-center justify-end text-sm text-muted-foreground mb-8">
                            Don't have an account?{" "}
                            <Link href={route('register')} className="ml-1 text-primary hover:underline">
                                Sign up
                            </Link>
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight">
                            Sign in to <span className="text-primary">Taskly</span>
                        </h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            {description}
                        </p>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}

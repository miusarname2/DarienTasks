import { Head, useForm } from '@inertiajs/react';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';
import { FormEvent, FormEventHandler, useState } from 'react';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Separator } from '@radix-ui/react-separator';
import CryptoJS from 'crypto-js';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        try {
            const response = await fetch(`${window.location.origin}/api/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    remember: data.remember,
                }),
            });

            const respData = await response.json();

            if (!response.ok) {
                throw new Error(respData.message || 'Error en credenciales');
            }

            const encryptedId = CryptoJS.AES.encrypt(respData.user.id.toString(), respData.token).toString();
            localStorage.setItem('eid', encryptedId);
            localStorage.setItem('token', respData.token);
            post(route('login'), {
                onFinish: () => reset('password'),
            });
        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
            reset('password');
        }
    };

    return (
        <AuthLayout
            title="Sign in to Taskly"
            description="Welcome to Taskly, please enter your login details below to start using the app."
        >
            <Head title="Log in" />

            <form onSubmit={submit} className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Enter your email"
                            className="h-12"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                                className="h-12 pr-10"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                    <Eye className="h-4 w-4 text-muted-foreground" />
                                )}
                            </Button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>

                            {canResetPassword && (
                                <TextLink href={route('password.request')} className="text-sm" tabIndex={5}>
                                    Forgot the password?
                                </TextLink>
                            )}
                        </div>

                        <InputError message={errors.password} />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-primary hover:bg-primary/90"
                    tabIndex={4}
                    disabled={processing}
                >
                    {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                    Login
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                </div>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12"
                >
                    Sign in with Google
                </Button>
            </form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}

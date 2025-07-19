import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthTwoColumnLayout from './auth/auth-two-column-layout';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <AuthTwoColumnLayout title={title} description={description} {...props}>
            {children}
        </AuthTwoColumnLayout>
    );
}

import { RecaptchaProvider } from "@/components/RecaptchaWrapper";
import Login from "@/components/Login";

export default function LoginPage() {
    return (
        <RecaptchaProvider>
            <Login />
        </RecaptchaProvider>
    );
}

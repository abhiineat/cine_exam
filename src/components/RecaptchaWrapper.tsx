"use client";

import {
    GoogleReCaptchaProvider,
    useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

export function RecaptchaProvider({ children }: { children: React.ReactNode }) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
        >
            {children}
        </GoogleReCaptchaProvider>
    );
}

export function useRecaptchaAction(action: string) {
    const { executeRecaptcha } = useGoogleReCaptcha();

    return async () => {
        if (!executeRecaptcha) return null;
        return await executeRecaptcha(action);
    };
}

import { useEffect, useState } from 'react';

export default function useTheme() {
    const [dark, setDark] = useState<boolean>(() =>
        localStorage.getItem('theme') === 'dark'
    );

    useEffect(() => {
        const root = window.document.documentElement;
        if (dark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [dark]);

    return { dark, toggleTheme: () => setDark(!dark) };
}

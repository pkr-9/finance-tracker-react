// create a simple utility function to concatenate class names

export function cn(...classes: (string | undefined | null)[]) {
    return classes.filter(Boolean).join(' ');
}

import * as yup from 'yup';

export const registerSchema = yup.object({
    username: yup.string().required('Username is required').min(2),
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().min(6, 'Minimum 6 characters').required('Password is required'),
});

export const loginSchema = yup.object({
    email: yup.string().email('Invalid email').required(),
    password: yup.string().required(),
});

export const transactionSchema = yup.object({
    title: yup.string().required(),
    amount: yup.number().positive('Must be positive').required(),
    category: yup.string().required(),
    date: yup.string().required(),
});

export const budgetSchema = yup.object({
    category: yup.string().required(),
    limit: yup.number().positive('Must be positive').required(),
});

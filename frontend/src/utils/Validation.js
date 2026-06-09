import * as yup from 'yup';

// User validation schemas
export const loginSchema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .required('Password is required'),
});

export const signupSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Please confirm your password'),
  companyName: yup
    .string()
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),
});

export const profileSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  companyName: yup
    .string()
    .max(200, 'Company name cannot exceed 200 characters')
    .optional(),
  phone: yup
    .string()
    .optional(),
  businessNumber: yup
    .string()
    .optional(),
  taxRate: yup
    .number()
    .min(0, 'Tax rate cannot be negative')
    .max(100, 'Tax rate cannot exceed 100%')
    .optional(),
});

export const passwordSchema = yup.object({
  currentPassword: yup
    .string()
    .required('Current password is required'),
  newPassword: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('New password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newPassword'), null], 'Passwords must match')
    .required('Please confirm your new password'),
});

// Invoice validation schema
export const invoiceSchema = yup.object({
  client: yup.object({
    name: yup.string().required('Client name is required'),
    email: yup.string().email('Valid email required').required('Client email is required'),
    company: yup.string().optional(),
    address: yup.object({
      street: yup.string().optional(),
      city: yup.string().optional(),
      state: yup.string().optional(),
      zipCode: yup.string().optional(),
      country: yup.string().optional(),
    }).optional(),
    phone: yup.string().optional(),
    taxId: yup.string().optional(),
  }),
  issueDate: yup.date().default(() => new Date()),
  dueDate: yup.date().min(yup.ref('issueDate'), 'Due date must be after issue date').required('Due date is required'),
  items: yup.array().of(
    yup.object({
      description: yup.string().required('Item description is required'),
      quantity: yup.number().positive('Quantity must be positive').required('Quantity is required'),
      unitPrice: yup.number().positive('Price must be positive').required('Price is required'),
      taxRate: yup.number().min(0).max(100).default(0),
    })
  ).min(1, 'At least one item is required'),
  discount: yup.number().min(0).default(0),
  discountType: yup.string().oneOf(['percentage', 'fixed']).default('fixed'),
  shipping: yup.number().min(0).default(0),
  notes: yup.string().optional(),
  terms: yup.string().optional(),
});

// Contact form validation schema
export const contactSchema = yup.object({
  name: yup
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .required('Name is required'),
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  subject: yup
    .string()
    .min(5, 'Subject must be at least 5 characters')
    .max(200, 'Subject cannot exceed 200 characters')
    .required('Subject is required'),
  message: yup
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message cannot exceed 5000 characters')
    .required('Message is required'),
  company: yup
    .string()
    .optional(),
  phone: yup
    .string()
    .optional(),
});
# Register Page Refactoring - Complete Documentation

## Overview

Complete refactoring of the registration system with **Split-Screen Design** and support for two distinct registration flows:
- **Cliente Registration**: For individual users/customers
- **Empresa Registration**: For company/provider users

---

## 1. Architecture Changes

### Type Definitions (`src/types/index.ts`)

#### RegisterRequest (Empresa)
```typescript
interface RegisterRequest {
  usuario: string;                    // Required: username
  email: string;                      // Required: email
  password: string;                   // Required: password
  nombre_Completo: string;            // Required: full name
  telefono?: string | null;           // Optional: phone
  empresa_Id?: number | null;         // Optional: company ID
  rol_Id: number;                     // Required: role ID (default: 2 for admin provider)
}
```

**Endpoint**: `POST /api/Auth/register`

#### RegisterClienteRequest (Cliente)
```typescript
interface RegisterClienteRequest {
  email: string;                      // Required: email
  password: string;                   // Required: password
  nombre_Completo: string;            // Required: full name
  telefono?: string | null;           // Optional: phone
  documento?: string | null;          // Optional: ID document
  tipo_Documento?: string | null;     // Optional: document type (CC, TI, PA, CE)
  direccion?: string | null;          // Optional: address
  ciudad?: string | null;             // Optional: city
  empresa_Id?: number | null;         // Optional: company ID
  tipo_Cliente?: string | null;       // Optional: client type (default: 'Persona')
}
```

**Endpoint**: `POST /api/Auth/register-cliente`

---

## 2. API Service (`src/features/auth/services/authService.ts`)

The service provides two registration methods:

```typescript
export const authService = {
  /**
   * Register as a company/provider user (Empresa)
   * POST /api/Auth/register
   */
  register: async (payload: RegisterRequest): Promise<void> => {
    await axiosInstance.post('/auth/register', payload);
  },

  /**
   * Register as a client (Cliente)
   * POST /api/Auth/register-cliente
   */
  registerCliente: async (payload: RegisterClienteRequest): Promise<void> => {
    await axiosInstance.post('/auth/register-cliente', payload);
  },
};
```

---

## 3. UI/UX Design (`src/pages/Register.tsx`)

### Layout Structure

#### Desktop (≥1024px)
```
┌─────────────────────────────────────────────────────────────┐
│                                                               │
│  ┌──────────────────┐  ┌──────────────────────────────────┐ │
│  │                  │  │                                  │ │
│  │  Decorative      │  │    Registration Form             │ │
│  │  Left Panel      │  │                                  │ │
│  │  (50% width)     │  │    • Tabs: Cliente/Empresa       │ │
│  │                  │  │    • Form Fields                 │ │
│  │  • Gradient      │  │    • Validation Messages         │ │
│  │  • Logo          │  │    • Submit Button               │ │
│  │  • Message       │  │                                  │ │
│  │                  │  │                                  │ │
│  └──────────────────┘  └──────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

#### Mobile (<1024px)
```
┌───────────────────────┐
│                       │
│  Registration Form    │
│  (Full Width)         │
│                       │
│  • Tabs               │
│  • Form Fields        │
│  • Submit Button      │
│                       │
└───────────────────────┘
```

### Design Details

**Left Panel (Desktop Only)**
- Hidden on mobile (`hidden lg:flex`)
- 50% width on desktop (`lg:w-1/2`)
- Gradient background: `from-blue-600 via-blue-700 to-indigo-900`
- Decorative blurred circles for visual interest
- Content:
  - Company name/logo: "EventConnect"
  - Welcome message
  - Call-to-action

**Right Panel**
- Full width on mobile, 50% on desktop
- Centered vertically
- Generous padding: `p-6 sm:p-8 lg:p-12`
- Maximum width constraint: `max-w-md`
- Content:
  - Page title: "Crear Cuenta"
  - Subtitle: "Únete a EventConnect hoy mismo"
  - Tab selector
  - Form fields (depends on active tab)
  - Submit button
  - Login link

---

## 4. Form Structure

### Tab 1: "Soy Cliente" Registration

**Form Fields**:
1. **Nombre Completo** - Text input (required)
2. **Email** - Email input (required, validated)
3. **Teléfono** - Tel input (optional)
4. **Tipo Documento** - Select dropdown (required)
   - Options: CC, TI, PA, CE
5. **Documento** - Text input (required)
6. **Dirección** - Text input (required)
7. **Ciudad** - Text input (required)
8. **Contraseña** - Password input (required, min 6 chars)
9. **Confirmar Contraseña** - Password input (required, must match)

**Validation Rules**:
- Nombre Completo: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password
- Documento: Required, non-empty
- Tipo Documento: Required, must select value
- Dirección: Required, non-empty
- Ciudad: Required, non-empty

**API Call**:
```typescript
authService.registerCliente({
  email: clienteData.email,
  password: clienteData.password,
  nombre_Completo: clienteData.nombre_Completo,
  telefono: clienteData.telefono.trim() || null,
  documento: clienteData.documento.trim() || null,
  tipo_Documento: clienteData.tipo_Documento || null,
  direccion: clienteData.direccion.trim() || null,
  ciudad: clienteData.ciudad.trim() || null,
  empresa_Id: null,
  tipo_Cliente: 'Persona',
});
```

### Tab 2: "Soy Empresa" Registration

**Form Fields**:
1. **Usuario** - Text input (required) - Username
2. **Nombre Completo** - Text input (required)
3. **Email** - Email input (required, validated)
4. **Teléfono** - Tel input (optional)
5. **Contraseña** - Password input (required, min 6 chars)
6. **Confirmar Contraseña** - Password input (required, must match)

**Validation Rules**:
- Usuario: Required, non-empty
- Nombre Completo: Required, non-empty
- Email: Required, valid email format
- Password: Required, minimum 6 characters
- Confirm Password: Must match password

**API Call**:
```typescript
authService.register({
  usuario: empresaData.usuario.trim(),
  email: empresaData.email,
  password: empresaData.password,
  nombre_Completo: empresaData.nombre_Completo,
  telefono: empresaData.telefono.trim() || null,
  empresa_Id: null,
  rol_Id: Number(import.meta.env.VITE_ROLE_ID_ADMIN_PROVEEDOR ?? 2),
});
```

---

## 5. State Management

### Active Tab State
```typescript
const [activeTab, setActiveTab] = useState('cliente');
```
- Values: `'cliente'` or `'empresa'`
- Controls which form is displayed

### Form Data States
```typescript
const [clienteData, setClienteData] = useState<ClienteFormData>({
  nombre_Completo: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: '',
  documento: '',
  tipo_Documento: '',
  direccion: '',
  ciudad: '',
});

const [empresaData, setEmpresaData] = useState<EmpresaFormData>({
  usuario: '',
  nombre_Completo: '',
  email: '',
  password: '',
  confirmPassword: '',
  telefono: '',
});
```
- Separate state for each registration type
- Prevents data cross-contamination between tabs

### UI State
```typescript
const [errors, setErrors] = useState<Record<string, string>>({});
const [isLoading, setIsLoading] = useState(false);
const [apiError, setApiError] = useState('');
```

---

## 6. Validation System

### Per-Tab Validation Functions

**validateClienteForm()**
- Validates all Cliente form fields
- Returns `boolean` indicating form validity
- Sets `errors` object with field-level error messages
- Clears on field change

**validateEmpresaForm()**
- Validates all Empresa form fields
- Returns `boolean` indicating form validity
- Sets `errors` object with field-level error messages
- Clears on field change

### Error Display
- Field-level errors appear below each input
- API errors displayed in alert box at top of form
- Errors clear when user starts typing in field
- Red border on inputs with errors

---

## 7. Event Handlers

### handleClienteChange(e)
- Updates `clienteData` state on input change
- Clears field error when user starts typing
- Maintains focus and selection state

### handleEmpresaChange(e)
- Updates `empresaData` state on input change
- Clears field error when user starts typing
- Maintains focus and selection state

### handleSubmit(e)
- Prevents default form submission
- Validates form based on active tab
- Returns early if validation fails
- Shows loading state while processing
- Calls appropriate `authService` method
- Handles API errors
- Navigates to login on success with `registered=true` query param

---

## 8. Environment Configuration

### VITE_ROLE_ID_ADMIN_PROVEEDOR
```
Environment Variable: VITE_ROLE_ID_ADMIN_PROVEEDOR
Type: Number
Default: 2
Usage: Sets rol_Id for company registration
```

Add to `.env` or `.env.local`:
```
VITE_ROLE_ID_ADMIN_PROVEEDOR=2
```

---

## 9. UI Components Used

| Component | Source | Purpose |
|-----------|--------|---------|
| `Tabs` | `@/components/ui/tabs` | Tab navigation between Cliente/Empresa |
| `TabsList` | `@/components/ui/tabs` | Container for tab triggers |
| `TabsTrigger` | `@/components/ui/tabs` | Individual tab button |
| `TabsContent` | `@/components/ui/tabs` | Content for each tab |
| `Button` | `@/components/ui/button` | Submit button with variants |
| `Input` | `@/components/ui/input` | Text/email/password/tel inputs |
| `Label` | `@/components/ui/label` | Form field labels |
| `Select` | `@/components/ui/select` | Dropdown for documento type |
| `SelectTrigger` | `@/components/ui/select` | Select button |
| `SelectContent` | `@/components/ui/select` | Dropdown content |
| `SelectItem` | `@/components/ui/select` | Individual dropdown option |

---

## 10. Styling (Tailwind CSS)

### Color Scheme
- Primary: Blue (`blue-600`, `blue-700`)
- Accent: Indigo (`indigo-900`)
- Error: Red (`red-500`, `red-600`, `red-700`)
- Neutral: Slate/Gray

### Responsive Breakpoints
- Mobile-first approach
- `lg:` breakpoint (1024px) for desktop features
- Left panel only visible on `lg` screens

### Key Utility Classes
- `flex`, `grid` - Layout
- `gap-*` - Spacing between items
- `p-*` - Padding
- `rounded-lg`, `rounded-full` - Border radius
- `shadow-*` - Shadows
- `bg-gradient-to-br` - Gradient backgrounds
- `mix-blend-multiply`, `filter`, `blur-3xl` - Decorative effects
- `space-y-*` - Vertical spacing between form groups

---

## 11. User Flow

### Registration Flow (Cliente)

```
1. User visits /registro
   ↓
2. Default tab: "Soy Cliente" is active
   ↓
3. User fills form (9 fields)
   ↓
4. User clicks "Crear Cuenta"
   ↓
5. Frontend validation runs
   ├─ If invalid → Display field errors, stay on form
   └─ If valid → Continue to step 6
   ↓
6. Submit to POST /api/Auth/register-cliente
   ├─ Loading state shown
   ├─ Disable button during request
   └─ Show spinner next to "Creando cuenta..."
   ↓
7. API response
   ├─ Error → Display message, allow retry
   └─ Success → Navigate to /login?registered=true
```

### Registration Flow (Empresa)

```
1. User visits /registro
   ↓
2. User clicks "Soy Empresa" tab
   ↓
3. Tab content switches to Empresa form
   ↓
4. User fills form (6 fields)
   ↓
5. User clicks "Crear Cuenta"
   ↓
6. Frontend validation runs
   ├─ If invalid → Display field errors, stay on form
   └─ If valid → Continue to step 7
   ↓
7. Submit to POST /api/Auth/register
   ├─ Loading state shown
   ├─ Disable button during request
   └─ Show spinner next to "Creando cuenta..."
   ↓
8. API response
   ├─ Error → Display message, allow retry
   └─ Success → Navigate to /login?registered=true
```

---

## 12. Testing Checklist

### Cliente Form
- [ ] All fields render correctly
- [ ] Can switch to Empresa tab and back
- [ ] Email validation works
- [ ] Password length validation works
- [ ] Password confirmation validation works
- [ ] All required fields show error on empty submit
- [ ] Error messages clear on input change
- [ ] API call uses `/auth/register-cliente` endpoint
- [ ] Successfully redirects to `/login?registered=true` on success

### Empresa Form
- [ ] All fields render correctly
- [ ] Can switch to Cliente tab and back
- [ ] Email validation works
- [ ] Password length validation works
- [ ] Password confirmation validation works
- [ ] All required fields show error on empty submit
- [ ] Error messages clear on input change
- [ ] API call uses `/auth/register` endpoint with correct `rol_Id`
- [ ] Successfully redirects to `/login?registered=true` on success

### Responsive Design
- [ ] Desktop layout (1024px+): Split screen displays correctly
- [ ] Left panel visible on desktop, hidden on mobile
- [ ] Mobile layout (<1024px): Full-width form
- [ ] Form fields stack properly
- [ ] Tabs render correctly on all screen sizes
- [ ] Buttons are touch-friendly on mobile

### Error Handling
- [ ] API errors display in error box
- [ ] Network errors handled gracefully
- [ ] Validation errors prevent submission
- [ ] Loading state prevents double submission

---

## 13. Files Modified

1. **src/types/index.ts**
   - Updated `RegisterRequest` interface
   - Updated `RegisterClienteRequest` interface

2. **src/features/auth/services/authService.ts**
   - Added documentation comments
   - Clarified endpoint paths

3. **src/pages/Register.tsx**
   - Complete redesign with split-screen layout
   - Separate form states for Cliente and Empresa
   - Tab-based UI with Tabs component
   - Comprehensive validation for both forms
   - Enhanced error handling
   - Responsive design

---

## 14. Future Enhancements

- [ ] Add password strength indicator
- [ ] Add email verification before account activation
- [ ] Add file upload for company documents (Empresa tab)
- [ ] Add terms & conditions checkbox with modal
- [ ] Add captcha for spam prevention
- [ ] Add phone number validation with international format
- [ ] Add document number validation (Colombian format)
- [ ] Add success toast/notification before redirect
- [ ] Add remember-me option
- [ ] Add social login options (Google, GitHub, etc.)

---

## 15. Troubleshooting

### Form Not Submitting
- Check browser console for errors
- Verify all required fields are filled
- Check network tab to see API response
- Ensure `authService` endpoints match backend

### Styles Not Applying
- Clear browser cache
- Rebuild Tailwind CSS: `npm run build`
- Verify Tailwind config includes component paths

### Validation Not Working
- Check console for JavaScript errors
- Verify regex patterns match expected format
- Test with valid email: `test@example.com`
- Test with password: minimum 6 characters

### API Errors
- Check backend API is running
- Verify endpoint URLs in `authService`
- Check API request/response in Network tab
- Verify payload structure matches backend expectations

---

## 16. References

- **Shadcn/ui Documentation**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **React Router**: https://reactrouter.com/
- **Lucide Icons**: https://lucide.dev/

---

**Last Updated**: February 3, 2026
**Version**: 1.0
**Status**: Production Ready

'use client'
import Modal from './Modal'
import { useAuthModal } from '@/store/useAuthModalStore'
import Button from '@/components/ui/Button'
import { FcGoogle } from 'react-icons/fc'
import Input from '@/components/ui/Input'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import toast from 'react-hot-toast'

interface LoginValues {
  email: string
  password: string
}

type LoginErrors = Partial<Record<keyof LoginValues, string>>

export default function LoginModal() {
  const { isLoginOpen, closeLogin, openRegister } = useAuthModal()

  const [values, setValues] = useState<LoginValues>({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<LoginErrors>({})
  const [loading, setLoading] = useState(false)

  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }))
  }

  const validate = () => {
    const newErrors: LoginErrors = {}

    if (!values.email.trim()) {
      newErrors.email = 'Email field is required!'
    } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
      newErrors.email = 'Enter a valid email!'
    }

    if (!values.password.trim()) {
      newErrors.password = 'Password field is required!'
    } else if (values.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters!'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setLoading(true)

    try {
      const { error } = await authClient.signIn.email({
        email: values.email,
        password: values.password,
      })

      if (error) {
        toast(error.message as string, {
          style: {
            background: '#3b1214',
            color: '#f5f3ee',
            border: '1px solid rgba(248,113,113,0.3)',
          },
        })
        return
      }

      toast('Logged in successfully', {
        style: {
          background: '#0a0a0a',
          color: '#e8c46b',
          border: '1px solid rgba(232,196,107,0.3)',
        },
      })
      setValues({ email: '', password: '' })
      closeLogin()
      router.refresh()
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
        {
          style: {
            background: '#3b1214',
            color: '#f5f3ee',
            border: '1px solid rgba(248,113,113,0.3)',
          },
        },
      )
    } finally {
      setLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: 'google',
      })
    } catch {
      toast('Google sign-in failed', {
        style: {
          background: '#3b1214',
          color: '#f5f3ee',
          border: '1px solid rgba(248,113,113,0.3)',
        },
      })
    }
  }

  return (
    <Modal onClose={closeLogin} isOpen={isLoginOpen} title='Sign in'>
      {/* ───────── Heading ───────── */}
      <div className='mb-8 space-y-2'>
        <h2 className='font-nouvelle text-2xl font-bold italic text-[#e8c46b] sm:text-3xl'>
          Welcome back
        </h2>
        <p className='text-xs uppercase tracking-[0.18em] text-[#f5f3ee]/40'>
          Sign in to your account
        </p>
      </div>

      <form onSubmit={onSubmit} className='space-y-6'>
        {/* ───────── Inputs ───────── */}
        <Input
          name='email'
          label='Email'
          type='email'
          value={values.email}
          error={errors.email}
          onChange={handleChange}
        />
        <Input
          name='password'
          label='Password'
          type='password'
          value={values.password}
          error={errors.password}
          onChange={handleChange}
        />

        {/* ───────── Primary CTA ───────── */}
        <div className='pt-2'>
          <Button
            disabled={loading}
            loading={loading}
            type='submit'
            variant='outline'
          >
            Continue
          </Button>
        </div>

        {/* ───────── Divider ───────── */}
        <div className='relative my-8'>
          <div className='absolute inset-0 flex items-center'>
            <div className='h-px w-full bg-white/[0.08]' />
          </div>
          <div className='relative flex justify-center'>
            <span className='bg-black px-4 text-[10px] uppercase tracking-[0.2em] text-[#fff]/35'>
              Or continue with
            </span>
          </div>
        </div>

        {/* ───────── Google ───────── */}
        <Button
          onClick={signInWithGoogle}
          type='button'
          variant='outline'
          icon={<FcGoogle size={18} />}
        >
          Continue with Google
        </Button>

        {/* ───────── Footer ───────── */}
        <p className='pt-2 text-center text-sm text-[#f5f3ee]/50'>
          Don&apos;t have an account?{' '}
          <button
            type='button'
            onClick={openRegister}
            className='group relative ml-1 inline-block text-[#e8c46b] transition-colors hover:text-[#f0d98a]'
          >
            Register
            <span className='absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-[#e8c46b] transition-transform duration-300 group-hover:scale-x-100' />
          </button>
        </p>
      </form>
    </Modal>
  )
}

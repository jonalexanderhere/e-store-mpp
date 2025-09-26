'use client'

import { useState } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      await signIn(data.email, data.password)
      toast.success('Login berhasil!')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Login gagal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
          Masuk ke akun Anda
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Atau{' '}
          <Link href="/auth/register" className="font-medium text-primary-600 hover:text-primary-500">
            daftar akun baru
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Masukkan email dan password Anda untuk masuk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Input
                label="Email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: 'Email wajib diisi',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Format email tidak valid'
                  }
                })}
                error={errors.email?.message}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                {...register('password', {
                  required: 'Password wajib diisi',
                  minLength: {
                    value: 6,
                    message: 'Password minimal 6 karakter'
                  }
                })}
                error={errors.password?.message}
              />

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </Button>
            </form>

            {/* Admin helper text removed for security */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
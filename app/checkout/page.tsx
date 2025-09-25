'use client'

import { useState, useEffect } from 'react'

export const dynamic = 'force-dynamic'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { CreditCard, Upload, CheckCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { getCurrentUser } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Cart, Product, Transaction } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface CheckoutForm {
  full_name: string
  email: string
  phone: string
  address: string
  payment_method: string
}

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<Cart[]>([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [paymentFile, setPaymentFile] = useState<File | null>(null)
  const router = useRouter()
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await getCurrentUser()
        if (!currentUser) {
          router.push('/auth/login')
          return
        }
        setUser(currentUser)

        // Fetch cart items with product details
        const { data, error } = await supabase
          .from('cart')
          .select(`
            *,
            product:products(*)
          `)
          .eq('user_id', currentUser.id)

        if (error) throw error
        setCartItems(data || [])

        if (data?.length === 0) {
          router.push('/cart')
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
        router.push('/cart')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const onSubmit = async (data: CheckoutForm) => {
    if (!paymentFile) {
      toast.error('Silakan upload bukti pembayaran')
      return
    }

    setProcessing(true)
    try {
      // Calculate total
      const subtotal = cartItems.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity
      }, 0)
      const tax = subtotal * 0.1
      const total = subtotal + tax

      // Upload payment proof
      const fileExt = paymentFile.name.split('.').pop()
      const fileName = `payment-${Date.now()}.${fileExt}`
      const filePath = `payments/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('uploads')
        .upload(filePath, paymentFile)

      if (uploadError) throw uploadError

      // Create transaction
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          total_amount: total,
          status: 'pending',
          payment_method: data.payment_method,
          payment_proof_url: filePath
        })
        .select()
        .single()

      if (transactionError) throw transactionError

      // Create transaction items
      const transactionItems = cartItems.map(item => ({
        transaction_id: transaction.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.product?.price || 0
      }))

      const { error: itemsError } = await supabase
        .from('transaction_items')
        .insert(transactionItems)

      if (itemsError) throw itemsError

      // Clear cart
      const { error: cartError } = await supabase
        .from('cart')
        .delete()
        .eq('user_id', user.id)

      if (cartError) throw cartError

      toast.success('Pesanan berhasil dibuat! Silakan tunggu konfirmasi admin.')
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.message || 'Gagal membuat pesanan')
    } finally {
      setProcessing(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getTotalPrice = () => {
    const subtotal = cartItems.reduce((total, item) => {
      return total + (item.product?.price || 0) * item.quantity
    }, 0)
    const tax = subtotal * 0.1
    return subtotal + tax
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Memuat checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="mt-2 text-gray-600">
            Lengkapi informasi untuk menyelesaikan pembelian
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pembeli</CardTitle>
                <CardDescription>
                  Isi data diri Anda untuk proses pembelian
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  {...register('full_name', {
                    required: 'Nama lengkap wajib diisi',
                    minLength: {
                      value: 2,
                      message: 'Nama minimal 2 karakter'
                    }
                  })}
                  error={errors.full_name?.message}
                />

                <Input
                  label="Email"
                  type="email"
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
                  label="Nomor Telepon"
                  {...register('phone', {
                    required: 'Nomor telepon wajib diisi',
                    pattern: {
                      value: /^[0-9+\-\s()]+$/,
                      message: 'Format nomor telepon tidak valid'
                    }
                  })}
                  error={errors.phone?.message}
                />

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Alamat Lengkap
                  </label>
                  <textarea
                    {...register('address', {
                      required: 'Alamat wajib diisi',
                      minLength: {
                        value: 10,
                        message: 'Alamat minimal 10 karakter'
                      }
                    })}
                    rows={3}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="Masukkan alamat lengkap Anda"
                  />
                  {errors.address && (
                    <p className="text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Metode Pembayaran</CardTitle>
                <CardDescription>
                  Pilih metode pembayaran yang Anda inginkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="bank_transfer"
                      {...register('payment_method', {
                        required: 'Pilih metode pembayaran'
                      })}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Transfer Bank
                    </span>
                  </label>
                  
                  <label className="flex items-center space-x-3">
                    <input
                      type="radio"
                      value="e_wallet"
                      {...register('payment_method')}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      E-Wallet (DANA, OVO, GoPay)
                    </span>
                  </label>
                </div>
                {errors.payment_method && (
                  <p className="text-sm text-red-600 mt-2">{errors.payment_method.message}</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bukti Pembayaran</CardTitle>
                <CardDescription>
                  Upload bukti pembayaran untuk verifikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setPaymentFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                  />
                  {paymentFile && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span className="text-sm">File berhasil dipilih</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">
                      {formatPrice((item.product?.price || 0) * item.quantity)}
                    </p>
                  </div>
                ))}
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatPrice(cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pajak (10%)</span>
                    <span>{formatPrice(cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0) * 0.1)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t pt-2">
                    <span>Total</span>
                    <span className="text-primary-600">{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              loading={processing}
              disabled={processing || !paymentFile}
            >
              <CreditCard className="h-5 w-5 mr-2" />
              {processing ? 'Memproses...' : 'Buat Pesanan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}


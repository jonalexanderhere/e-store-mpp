import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file || !orderId) {
      return NextResponse.json({ error: 'File and orderId are required' }, { status: 400 })
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${orderId}-payment-proof.${fileExt}`
    const filePath = `payment-proofs/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('uploads')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Update order with payment proof URL
    const { error: updateError } = await supabase
      .from('orders')
      .update({ payment_proof_url: filePath })
      .eq('id', orderId)

    if (updateError) throw updateError

    return NextResponse.json({ 
      success: true, 
      filePath,
      message: 'File uploaded successfully' 
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}


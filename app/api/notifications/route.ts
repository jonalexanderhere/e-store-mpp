import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')

    if (!user_id) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        order:orders(*)
      `)
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json({ notifications: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, title, message, type, order_id } = body

    if (!user_id || !title || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id,
        title,
        message,
        type: type || 'info',
        order_id
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ notification: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { notification_id, read } = body

    if (!notification_id) {
      return NextResponse.json({ error: 'Notification ID required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('notifications')
      .update({ read })
      .eq('id', notification_id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({ notification: data })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

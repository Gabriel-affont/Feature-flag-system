import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase/server';
import { cookies } from 'next/headers';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const cookieStore =  cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();

    const { data, error } = await supabase
      .from('feature_flags')
      .update({
        ...(body.name !== undefined && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.enabled !== undefined && { enabled: body.enabled }),
        ...(body.enabled_for_users !== undefined && {
          enabled_for_users: body.enabled_for_users,
        }),
        ...(body.enabled_for_percent !== undefined && {
          enabled_for_percent: body.enabled_for_percent,
        }),
      })
      .eq('key', params.key)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const cookieStore =  cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase
      .from('feature_flags')
      .delete()
      .eq('key', params.key);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
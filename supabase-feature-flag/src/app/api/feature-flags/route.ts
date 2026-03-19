import {NextRequest, NextResponse} from 'next/server';
import { createClient } from '../../../../lib/supabase/server';
import {cookies} from 'next/headers';
import { create } from 'domain';

export async function GET(request: NextRequest) {
  try {
    const cookieStore =  cookies();
    const supabase = createClient(cookieStore);
    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .order('created_at', { ascending: false });

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

export async function POST(request: NextRequest) {
  try {
    const cookieStore =  cookies();
    const supabase = createClient(cookieStore);
    const body = await request.json();

    if (!body.key || !body.name) {
      return NextResponse.json(
        { error: 'key and name are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('feature_flags')
      .insert({
        key: body.key,
        name: body.name,
        description: body.description || null,
        enabled: body.enabled || false,
        enabled_for_users: body.enabled_for_users || [],
        enabled_for_percent: body.enabled_for_percent || 0,
        metadata: body.metadata || {},
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
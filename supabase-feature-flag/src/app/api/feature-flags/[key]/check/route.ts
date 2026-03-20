import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../../lib/supabase/server';
import { cookies } from 'next/headers';

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const userId = request.nextUrl.searchParams.get('userId') || undefined;

    const { data, error } = await supabase
      .from('feature_flags')
      .select('*')
      .eq('key', params.key)
      .single();

    if (error || !data) {
      return NextResponse.json({ enabled: false, reason: 'Flag not found' });
    }

    // Check if globally enabled
    if (data.enabled) {
      return NextResponse.json({ enabled: true, reason: 'globally_enabled' });
    }

    // Check if enabled for specific user
    if (userId && data.enabled_for_users?.includes(userId)) {
      return NextResponse.json({ enabled: true, reason: 'user_specific' });
    }

    // Check percentage rollout
    if (data.enabled_for_percent > 0) {
      const hash = userId
        ? [...userId].reduce((acc, c) => acc + c.charCodeAt(0), 0) % 100
        : Math.random() * 100;
      if (hash < data.enabled_for_percent) {
        return NextResponse.json({ enabled: true, reason: 'percent_rollout' });
      }
    }

    return NextResponse.json({ enabled: false, reason: 'disabled' });
  } catch {
    return NextResponse.json({ enabled: false, reason: 'error' });
  }
}
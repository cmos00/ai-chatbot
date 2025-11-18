import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';

// Expo의 extra 설정에서 환경변수 가져오기
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl || process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase URL 또는 Anon Key가 설정되지 않았습니다.');
  console.error('   .env 파일 또는 app.json의 extra 섹션을 확인하세요.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Expo에서 자동으로 토큰 새로고침
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * 사용자 정보를 Supabase에 저장하거나 업데이트
 * @param {Object} userData - 사용자 데이터
 * @returns {Promise<Object>} 저장된 사용자 데이터
 */
export async function upsertUser(userData) {
  try {
    const { data, error } = await supabase
      .from('users')
      .upsert(
        {
          google_id: userData.id,
          email: userData.email,
          name: userData.name,
          picture: userData.picture,
          last_login: new Date().toISOString(),
        },
        {
          onConflict: 'google_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase upsert error:', error);
      throw error;
    }

    console.log('✅ 사용자 정보 저장 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 사용자 정보 저장 실패:', error);
    throw error;
  }
}

/**
 * Google ID로 사용자 정보 조회
 * @param {string} googleId - Google 사용자 ID
 * @returns {Promise<Object|null>} 사용자 데이터
 */
export async function getUserByGoogleId(googleId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116: 결과 없음 (정상)
      console.error('Supabase select error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('❌ 사용자 조회 실패:', error);
    return null;
  }
}


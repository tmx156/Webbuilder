import { createClient } from '@supabase/supabase-js'
import { supabaseConfig } from '../config'

const supabaseUrl = supabaseConfig.url
const supabaseKey = supabaseConfig.key

export const supabase = createClient(supabaseUrl, supabaseKey) 
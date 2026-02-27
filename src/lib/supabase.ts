import { createClient } from '@supabase/supabase-js'

const VITE_ENV = (import.meta as any).env || {}
// front end config uses VITE_ variables but the backend env also contains
// SUPABASE_URL / SUPABASE_ANON_KEY.  we’ll gracefully fall back so that
// forgetting to prefix the vars doesn’t immediately break the client during
// development (the network error reported earlier was due to empty URL).
const supabaseUrl =
  VITE_ENV.VITE_SUPABASE_URL ||
  VITE_ENV.SUPABASE_URL || // fallback for cases where .env wasn’t updated
  ''
const supabaseAnonKey =
  VITE_ENV.VITE_SUPABASE_ANON_KEY ||
  VITE_ENV.SUPABASE_ANON_KEY ||
  ''

console.log('🔧 Supabase Configuration:', {
  url: supabaseUrl ? '✅ Present' : '❌ Missing',
  key: supabaseAnonKey ? '✅ Present' : '❌ Missing',
  isDev: Boolean(VITE_ENV.DEV),
})

if (!supabaseUrl || !supabaseAnonKey) {
  // Log error instead of throwing so the app can render and display a message
  console.error('❌ Missing Supabase environment variables. Please check your .env file.')
}

// If variables are missing, createClient will still return an object but requests
// will fail; components should handle errors gracefully.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth functions
export const signUp = async (email: string, password: string) => {
  try {
    console.log('📤 Sending signup request...', { email, url: supabaseUrl })
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) {
      console.error('📥 Signup error response:', { error: error.message, status: error.status })
      throw error
    }
    console.log('📥 Signup auth successful:', { userId: data.user?.id, email: data.user?.email })
    console.log(
      '📧 Email confirmation required:',
      'A confirmation link has been sent to the email address. User must confirm before signing in.'
    )

    // Create user record in database
    if (data.user?.id) {
      try {
        await createUserRecord(data.user.id, email)
      } catch (dbErr: any) {
        console.error('❌ Failed to create user record in DB after signup:', {
          message: dbErr.message,
          userId: data.user.id,
        })
        // Log the error but don't fail the signup - auth user was created
        // The record can be created on first login
      }
    }

    return data
  } catch (err: any) {
    console.error('🔴 Signup failed:', {
      message: err.message,
      status: err.status,
      originalError: err,
    })
    throw err
  }
}

export const signIn = async (email: string, password: string) => {
  try {
    console.log('📤 Sending signin request...', { email, url: supabaseUrl })
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) {
      // Log email confirmation error specifically
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        console.warn('📧 Email confirmation pending:', {
          error: error.message,
          status: error.status,
          email,
        })
      } else {
        console.error('📥 Signin error response:', { error: error.message, status: error.status })
      }
      throw error
    }
    console.log('📥 Signin response received:', { userId: data.user?.id, session: !!data.session })

    // Fetch user profile from database
    if (data.user?.id) {
      try {
        const userProfile = await getUserProfile(data.user.id)
        if (!userProfile) {
          console.warn('⚠️ User profile not found in DB, creating it...')
          // User record doesn't exist, try to create it
          try {
            await createUserRecord(data.user.id, email)
            console.log('✅ User record created on first signin')
          } catch (createErr: any) {
            console.error('❌ Failed to create user record on signin:', createErr.message)
            // Log but don't fail - user is still authenticated
          }
        }
      } catch (profileErr: any) {
        console.error('❌ Error handling user profile during signin:', profileErr.message)
        // Log but don't fail - user is still authenticated
      }
    }

    return data
  } catch (err: any) {
    console.error('🔴 Signin failed:', {
      message: err.message,
      status: err.status,
      originalError: err,
    })
    throw err
  }
}

export const signOut = async () => {
  try {
    console.log('📤 Sending logout request...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('📥 Logout error response:', { error: error.message })
      throw error
    }
    console.log('✅ Logged out successfully')
  } catch (err: any) {
    console.error('🔴 Logout failed:', { message: err.message })
    throw err
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    console.log('📥 Current user:', { userId: user?.id })
    return user
  } catch (err: any) {
    console.error('🔴 Get current user failed:', { message: err.message })
    throw err
  }
}

// Database user management functions
export const createUserRecord = async (userId: string, email: string) => {
  try {
    console.log('📤 Creating user record in DB...', { userId, email })
    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email,
          created_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error('📥 User record creation error:', { error: error.message, code: error.code })
      throw error
    }

    console.log('📥 User record created successfully:', { userId, email })
    return data
  } catch (err: any) {
    console.error('🔴 Create user record failed:', {
      message: err.message,
      code: err.code,
      originalError: err,
    })
    throw err
  }
}

export const getUserProfile = async (userId: string) => {
  try {
    console.log('📤 Fetching user profile from DB...', { userId })
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      // "PGRST116" is the code for "no rows found"
      if (error.code === 'PGRST116') {
        console.warn('⚠️ User record not found in DB:', { userId })
        return null
      }
      console.error('📥 User profile fetch error:', { error: error.message, code: error.code })
      throw error
    }

    console.log('📥 User profile retrieved:', { userId, email: data?.email })
    return data
  } catch (err: any) {
    console.error('🔴 Get user profile failed:', {
      message: err.message,
      code: err.code,
      originalError: err,
    })
    throw err
  }
}

export const getCurrentUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('ℹ️ No authenticated user')
      return null
    }

    console.log('🔍 Fetching current user profile...', { userId: user.id })
    return await getUserProfile(user.id)
  } catch (err: any) {
    console.error('🔴 Get current user profile failed:', { message: err.message })
    throw err
  }
}

// Expense functions
export const fetchExpenses = async (userId: string) => {
  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      user_id,
      amount,
      date,
      note,
      category_id,
      categories (
        id,
        name
      )
    `)
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) throw error
  
  // Type the response properly
  return (data as any[]).map(exp => ({
    ...exp,
    categories: exp.categories ? exp.categories[0] : null
  })) as unknown as any[]
}

export const fetchExpensesByMonth = async (
  userId: string,
  year: number,
  month: number
) => {
  const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0]
  const endDate = new Date(year, month, 0).toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('expenses')
    .select(`
      id,
      user_id,
      amount,
      date,
      note,
      category_id,
      categories (
        id,
        name
      )
    `)
    .eq('user_id', userId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: false })

  if (error) throw error
  
  // Type the response properly
  return (data as any[]).map(exp => ({
    ...exp,
    categories: exp.categories ? exp.categories[0] : null
  })) as unknown as any[]
}

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data
}

export const insertExpense = async (
  userId: string,
  amount: number,
  categoryId: string,
  date: string,
  note?: string
) => {
  const { data, error } = await supabase
    .from('expenses')
    .insert([
      {
        user_id: userId,
        amount,
        category_id: categoryId,
        date,
        note: note || null,
      },
    ])
    .select()

  if (error) throw error
  return data
}

export const deleteExpense = async (expenseId: string) => {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId)

  if (error) throw error
}

export const updateExpense = async (
  expenseId: string,
  amount: number,
  categoryId: string,
  date: string,
  note?: string
) => {
  const { data, error } = await supabase
    .from('expenses')
    .update({
      amount,
      category_id: categoryId,
      date,
      note: note || null,
    })
    .eq('id', expenseId)
    .select()

  if (error) throw error
  return data
}

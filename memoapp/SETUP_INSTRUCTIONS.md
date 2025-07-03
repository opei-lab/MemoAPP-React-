# Supabase Setup Instructions for MemoApp

## Issue Summary

The application is experiencing two main issues:
1. Email confirmation links show a blank page (though login works after confirmation)
2. The "Create memo" button disappears without creating a memo

## Root Cause

The most likely cause is that the `memos` table doesn't exist in your Supabase database or Row Level Security (RLS) policies are not properly configured.

## Solution Steps

### 1. Create the Memos Table

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Run the SQL script from `supabase-schema.sql` (included in this project)

### 2. Verify Email Templates

For the blank page issue after email confirmation:

1. Go to Supabase Dashboard → Authentication → Email Templates
2. Check the "Confirm signup" template
3. Make sure the redirect URL is correct. It should be something like:
   ```
   {{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=signup
   ```
4. Also verify your Site URL in Authentication → URL Configuration

### 3. Check Environment Variables

Ensure your `.env` file has the correct values:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Enable Supabase Authentication

1. Go to Authentication → Providers
2. Make sure Email provider is enabled
3. Check that "Confirm email" is enabled if you want email verification

### 5. Debug Steps

The updated code now includes better error logging. When you try to create a memo:

1. Open the browser console (F12)
2. Try to create a memo
3. Check for error messages like:
   - "Error adding memo: relation 'memos' does not exist" → Table needs to be created
   - "Error adding memo: new row violates row-level security policy" → RLS policies need adjustment

### 6. Test the Fix

After setting up the database:

1. Sign out and sign back in
2. Try creating a new memo
3. The memo should appear on the board

## Additional Notes

- If you're still seeing issues with email confirmation, you might need to configure your redirect URLs in Supabase
- The SQL script includes Row Level Security (RLS) policies that ensure users can only see and modify their own memos
- Make sure your Supabase project is not paused (free tier projects pause after inactivity)
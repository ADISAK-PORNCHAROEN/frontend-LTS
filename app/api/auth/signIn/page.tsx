'use client'

import { useCallback, useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Alert from '#/components/modal/Alert'
import { Box, Button, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session, status, update } = useSession()
  const user = session?.user;

  // modal
  const [textAlertBox, setTextAlertBox] = useState("");
  const [typeAlertBox, setTypeAlertBox] = useState<"success" | "warning" | "error">("success");
  const [isOpenAlertBox, setIsOpenAlertBox] = useState(false);

  const Role = {
    admin: 'admin',
    member: 'member'
  }

  const handleRedirect = useCallback(async () => {
    if (session && status === 'authenticated') {
      try {
        await router.refresh();
        router.push('/api/auth/redirect');
      } catch (error) {
        console.error('Redirect error:', error);
      }
    }
  }, [session, status, router]);
  
  useEffect(() => {
    if (!session || status !== 'authenticated') return;
    handleRedirect();
  }, [session, status, handleRedirect]);  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setIsOpenAlertBox(true);
        setTypeAlertBox("error");
        setTextAlertBox(result.error);
        setTimeout(() => {
          setIsOpenAlertBox(false);
        }, 1500)
      } else {
        await handleRedirect()
      }
    } catch (error) {
      setIsOpenAlertBox(true);
      setTypeAlertBox("error");
      setTextAlertBox(error as string);
      setTimeout(() => {
        setIsOpenAlertBox(false);
      }, 1500)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      const result = await signIn('google', {
        callbackUrl: '/api/auth/redirect', // กำหนด URL ที่จะ redirect ไปหลังจาก sign in สำเร็จ
      })
    } catch (error) {
      console.error('Google sign in error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen w-screen m-0 p-0" style={{ backgroundColor: '#F2F4F7' }}>
        <form
          onSubmit={handleSubmit}
          className="w-96 rounded-md bg-white p-6 shadow-lg"
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            fontWeight="bold"
            className="mb-4"
          >
            Sign In
          </Typography>

          <Box sx={{ my: 2 }}>
            <hr />
          </Box>

          <div className="space-y-4">
            <TextField
              fullWidth
              required
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              variant="outlined"
              size="small"
              className="w-full"
            />

            <TextField
              fullWidth
              required
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              variant="outlined"
              size="small"
              className="w-full"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="mt-6 w-full rounded-lg"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>

            <Typography align="center" gutterBottom>
              Don&apos;t have an account?{' '}
              <Link href="/lts/api/auth/signUp" className="">
                Sign up
              </Link>
            </Typography>
          </div>

          <Box sx={{ my: 2 }}>
            <hr />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignIn}
            disabled={loading}
            startIcon={<GoogleIcon />}
            sx={{
              mt: 1,
              borderColor: 'rgba(0, 0, 0, 0.23)',
              color: 'rgba(0, 0, 0, 0.87)',
              '&:hover': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
              }
            }}
          >
            {loading ? 'Signing in...' : 'Sign in with Google'}
          </Button>
        </form>
      </div>

      <Alert
        text={textAlertBox}
        type={typeAlertBox}
        isOpen={isOpenAlertBox}
        setIsOpen={setIsOpenAlertBox}
      />
    </>
  )
}
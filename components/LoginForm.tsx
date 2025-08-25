'use client';

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { signIn, signUp } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const verified = searchParams.get('verified');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState("");
  const [registrationError, setRegistrationError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signIn.email({
        email,
        password,
        callbackURL: "/dashboard"
      });

      if (error) {
        console.log({ error });
        setError(error.message || "Invalid email or password");
      } else if (data) {
        router.push("/dashboard");
      }
    } catch (error) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setRegistrationError("");

    if (password !== passwordConfirmation) {
      setRegistrationError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await signUp.email({
        email,
        password,
        name,
      });

      if (error) {
        console.log({ error });
        setRegistrationError(error.message || 'Registration failed');
      } else if (data) {
        // Show success message and switch to login form
        setIsRegistering(false);
        setEmail("");
        setPassword("");
        setName("");
        // You can show a success message here instead of alert
        toast.success("Verification email sent successfully! Please check your inbox for verification link.");
      }
    } catch (error) {
      setRegistrationError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({
        provider: "google",
        callbackURL: "/dashboard"
      });
    } catch (error) {
      setError("Google sign in failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        {verified && (
          <div className="bg-emerald-500/15 text-emerald-500 p-3 rounded-md text-sm dark:bg-emerald-500/10 dark:text-emerald-400">
            Email verified successfully! You can now log in.
          </div>
        )}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold">
            {isRegistering ? "Create an Account" : "Login to your account"}
          </h1>
          <p className="text-muted-foreground">
            {isRegistering
              ? "Fill in your details to create an account"
              : "Choose your preferred login method"}
          </p>
        </div>

        {!isRegistering && (
          <>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={isRegistering ? handleRegister : handleSubmit} className="space-y-4">
          {(error || registrationError) && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 dark:bg-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive dark:text-destructive-foreground" />
              <span className="text-sm text-destructive dark:text-destructive-foreground">
                {error || registrationError}
              </span>
            </div>
          )}

          {isRegistering && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              {!isRegistering && (
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              )}
            </div>

            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                autoComplete="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-400" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-400" />
                )}
              </button>
            </div>
          </div>

          {isRegistering && (
            <div className="grid gap-2">
              <Label htmlFor="password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="password_confirmation"
                  type={showPasswordConfirmation ? "text" : "password"}
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Confirm Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                >
                  {showPasswordConfirmation ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading
              ? (isRegistering ? "Creating account..." : "Signing in...")
              : (isRegistering ? "Create Account" : "Sign in with Email")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError("");
              setRegistrationError("");
            }}
            className="text-primary hover:underline"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Create one"}
          </button>
        </div>
        <div className="flex justify-center w-full border-t py-4">
          <p className="text-center text-xs text-neutral-500">
            Secured by <span className="text-orange-400">better-auth</span>
          </p>
        </div>
      </div>
    </div>
  );
} 

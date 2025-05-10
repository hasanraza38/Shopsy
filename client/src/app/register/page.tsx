"use client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Loader2, Terminal } from "lucide-react"
import { useRouter } from 'next/navigation';
import { api } from "@/lib/utils";
import { toast } from "sonner";


type FormData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  avatar: FileList | null;
};


const Register = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null);
  const [apiError, setApiError] = useState<string | null>(null)
  const router = useRouter();


  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const password = watch("password")


  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setApiError(null)

    try {
      const file = data.avatar?.[0]

      const formData = new FormData()
      if (file) formData.append("avatar", file)
      formData.append("username", data.username)
      formData.append("email", data.email)
      formData.append("password", data.password)

      // console.log(formData);


      const response = await api.post("auth/registeruser", formData)
      // console.log(response.data)
      setSignupSuccess(true)
      toast.success("Account Created Successfully Redirecting to Login...")
    } catch (error: any) {
      console.error("Signup error:", error)
      setFormData(data)

      if (error.response) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage || "Please check your information and try again.")
        }
        else if (error.response.status === 401) {
          const errorMessage = error.response.data.message || error.response.data.error
          setApiError(errorMessage || "Please check your information and try again.")
        }
        else if (error.response.status === 500) {
          setApiError(error.response.data.message || "Server error. Please try again later")
        } else {
          setApiError(error.response.data.message || "Registration failed. Please try again.")
        }
      } else if (error.request) {
        setApiError("No response from server. Please check your internet connection and try again later.")
      } else {
        setApiError("An error occurred. Please try again.")
      }
    } finally {
      setIsLoading(false)

    }
  };



  useEffect(() => {
    // console.log(apiError);
    if (apiError) {
      toast.error("Signup Failed", {
        description: apiError,
        action: {
          label: "Try Again",
          onClick: () => {
            if (formData) {
              onSubmit(formData);
            }
          },
        },
      });
    }
  }, [apiError]);


  useEffect(() => {
    if (signupSuccess) {
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    }
  }, [signupSuccess, router]);



  return (
    <div className="min-h-screen flex justify-center items-center">

      <div className="w-full max-w-md mx-auto p-6 sm:p-8 ml-5 mr-5 bg-amber-200 rounded-2xl shadow-2xl shadow-zinc-600 ">
        <h1 className="text-center font-bold text-2xl mb-3">Create Account</h1>

        {apiError && (
          <div className="mx-6 mt-4 p-3  text-red-700 font-semibold">{apiError}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col items-center gap-2">

          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="" htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              className={`border border-black shadow shadow-zinc-500 ${errors.email ? "border-red-500" : "border-black"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="grid w-full max-w-sm items-center gap-1.5 ">
            <Label htmlFor="username" className="">Username</Label>
            <Input
              type="text"
              id="username"
              placeholder="username"
              {...register("username", {
                required: "Username is required",
                minLength: {
                  value: 3,
                  message: "Username must be at least 3 characters",
                },
              })}
              className={`border border-black shadow shadow-zinc-500 ${errors.username ? "border-red-500" : "border-black"}`}

            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
              className={`border border-black shadow shadow-zinc-500 ${errors.password ? "border-red-500" : "border-black"}`}


            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>


          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="confirmpassword">Confirm Password</Label>
            <Input
              type="password"
              id="confirmpassword"
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) => value === password || "Passwords do not match",
              })}
              className={`border border-black shadow shadow-zinc-500 ${errors.confirmPassword ? "border-red-500" : "border-black"}`}


            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Controller
            name="avatar"
            control={control}
            rules={{ required: "avatar is required" }}
            render={({ field }) => (
              <div className="grid w-full max-w-sm items-center gap-1.5">

                <Label htmlFor="avatar">Avatar</Label>
                <Input
                  className="bg-amber-50 shadow shadow-zinc-500"
                  type="file"
                  id="avatar"

                  accept="avatar/*"
                  onChange={(e) => field.onChange(e.target.files)}
                />
                {errors.avatar && (
                  <p className="text-red-500 text-sm">{errors.avatar.message}</p>
                )}
              </div>
            )}
          />



          {
            isLoading ?
              <Button className="mt-2" disabled>
                <Loader2 className="animate-spin " />
                Creating Account...
              </Button> :
              <Button variant="ghost" className=" mt-2 font-semibold shadow-lg shadow-zinc-800 hover:bg-amber-100">Create Account</Button>
          }


        </form>

        <p className="text-center mt-3 font-semibold">Already have an account? <span className="underline-offset-4 hover:underline" ><Link href="/login">Login</Link></span></p>

      </div>




    </div>
  )
}

export default Register











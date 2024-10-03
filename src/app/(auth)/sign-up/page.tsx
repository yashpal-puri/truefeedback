'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signinSchema } from "@/schemas/signin.schema";
import Link from "next/link"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { useDebounceCallback, useDebounceValue } from 'usehooks-ts'
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signup.schema";
import axios, {AxiosError} from 'axios';
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormLabel, FormItem, FormField, FormMessage, FormControl, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";



const Page = () => {
  const [username, setUsername] = useState('');
  const debounceUsername = useDebounceCallback(setUsername,300);
  const [usernameMsg, setUsernameMsg] = useState('');
  const [isUnameUnique, setIsUnameUnique] = useState(false);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setisSubmitting] = useState(false);
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      password: '',
      email: ''
    }

  })

  useEffect(()=>{
    const checkUsernameUnique = async ()=>{
      setUsernameMsg('');
      setIsUnameUnique(false);
      if(username){
        setIsCheckingUsername(true);
        try {
          const res = await axios.get(`/api/checkusername-unique?username=${username}`);
          setUsernameMsg(res.data.message);
          setIsUnameUnique(res.data.message == 'Username available!');
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMsg(axiosError.response?.data.message ?? "Error checking the username");
          toast({
            title: 'Error',
            description: axiosError.response?.data.message ?? "Error checking the username",
            variant: "destructive"
          })
          console.error("Some Error in checking the username unique")
        } finally{
            setIsCheckingUsername(false); 
        }
      }
    }
    checkUsernameUnique();
  },[username])

  
  const onSubmit = async (data: z.infer<typeof signupSchema>)=>{
    try {
      setisSubmitting(true);
      const res = await axios.post<ApiResponse>('/api/sign-up', data);
      toast({
        title: 'Sign up Successful',
        description: res.data.message,
      })
      router.replace(`/verify/${username}`);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;      
      console.error("Some Error in registering the user");
      toast({
        title: 'Signup Failed',
        description: axiosError.response?.data.message ?? "Error registering the user",
        variant: "destructive"
      })
    } finally {
      setisSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username here" {...field} 
                    onChange={(e)=>{
                      field.onChange(e);
                      debounceUsername(e.target.value);
                    }}
                    />
                  </FormControl>
                  {
                    isCheckingUsername ? <Loader2 className="animate-spin"/> : <p className={`${isUnameUnique? 'text-blue-500' : 'text-red-500'} text-sm`}>{usernameMsg}</p>
                  }
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="youremail@domain" {...field}                   
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password*</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password- Min. Len 6" {...field}                   
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
             type="submit"
             disabled={isSubmitting}
            >
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Signing Up.. 
                  </>
                ) : ('Sign-Up')
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;

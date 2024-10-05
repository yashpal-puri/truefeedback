'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { signinSchema } from "@/schemas/signin.schema";
import Link from "next/link"
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
import axios, {AxiosError} from 'axios';
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormLabel, FormItem, FormField, FormMessage, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";



const Page = () => {
  const [isSubmitting, setisSubmitting] = useState(false);
  const { toast } = useToast()
  const router = useRouter();

  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: '',
      password: ''
    }
  })

  

  
  const onSubmit = async (data: z.infer<typeof signinSchema>)=>{
    try {
      setisSubmitting(true);
      const res = await signIn('credentials',{
        identifier : data.identifier,
        password: data.password,
        redirect: false,
      })
      if(res?.ok){
        toast({
          title: 'Successful',
          description: 'Sign-in Successful',
        })
        router.replace(`/dashboard`);
      }
      if(!res?.ok){
        toast({
          title: 'Failed',
          description: res?.error || 'Sign-in Failed',
          variant: 'destructive'
        })
      }      
    } catch (error:any) {
      console.error("Some Error in Sign-In ", error);
      toast({
        title: 'Signin Failed',
        description: error?.message || "Error Signing In the user",
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
            Sign-In to your Account
          </h1>          
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Username/Email here" {...field}                     
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
            Want to Join?{' '}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
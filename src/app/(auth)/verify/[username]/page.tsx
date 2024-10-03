'use client'
import { useToast } from '@/hooks/use-toast';
import { verifysignupSchema } from '@/schemas/verifysignup.schema';
import { ApiResponse } from '@/types/apiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import { usernameValidation } from "@/schemas/signup.schema";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import * as z from 'zod';
import { Loader2 } from "lucide-react";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const { toast } = useToast();
    const [isSubmitting, setisSubmitting] = useState(false);

    const form = useForm<z.infer<typeof verifysignupSchema>>({
        resolver: zodResolver(verifysignupSchema),
        defaultValues: {
            code: "",
        }
    })

    useEffect(()=>{
        const usernameQuerySchema = z.object({
            username: usernameValidation
        })
        const username = params.username;
        const result1 = usernameQuerySchema.safeParse({username});
        

        if(!result1.success){
            alert("Not a Valid Username, Signup first");
            router.replace('/sign-up');
        }
    },[])

    const onSubmit = async (data: z.infer<typeof verifysignupSchema>) => {
        try {
            setisSubmitting(true);
            const username = params.username;
            const dataToSend = { username, verifycode: data.code }
            const res = await axios.get<ApiResponse>('/api/verify-code', { params: dataToSend });
            toast({
                title: 'Success',
                description: res.data.message || "OTP Verified successfully",
            })
            router.replace(`/sign-in`);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            console.error("Some Error in verifying the OTP");
            toast({
                title: 'Error',
                description: axiosError.response?.data.message ?? "Error verifying the OTP",
                variant: "destructive"
            })
        } finally {
            setisSubmitting(false);
        }
    }


    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-800'>
            <div className='w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md'>
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Verify Your Account
                    </h1>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>One-Time Password*</FormLabel>
                                        <FormControl>
                                            <InputOTP maxLength={6} {...field}>
                                                <InputOTPGroup>
                                                    <InputOTPSlot index={0} />
                                                    <InputOTPSlot index={1} />
                                                    <InputOTPSlot index={2} />
                                                    <InputOTPSlot index={3} />
                                                    <InputOTPSlot index={4} />
                                                    <InputOTPSlot index={5} />
                                                </InputOTPGroup>
                                            </InputOTP>
                                        </FormControl>
                                        <FormDescription>
                                            Please enter the one-time password sent to your Email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" disabled={isSubmitting}>
                                {
                                    isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting..
                                        </>
                                    ) : ('Submit')
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>

        </div>
    );
}

export default VerifyAccount;

"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
function Page() {
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams<{ username: string }>();
  const form = useForm({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const onSubmit = async(data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      toast.success("Sucess", {
        description: response.data.message,
      });
      form.reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message || "failed to send messagae",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4 flex justify-center">
        Public Profile Link
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">
          Send anonymous to @{params.username}
        </h2>{" "}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type Your Message</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      className="w-full p-10 pl-3 pt-5"
                      placeholder="Write your anonymous message here"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                  </>
                ) : (
                  "Send"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      <Separator />
      <div className="flex flex-col items-center mt-6 gap-4">
        <p>Get Your Own Message Board</p>
        <Link href="/sign-in">
          <Button>Sign In</Button>
        </Link>
      </div>
    </div>
  );
}

export default Page;


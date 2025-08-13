"use client";

import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import axios from "axios";

const sendMoneySchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(1, "Amount must be at least ₹1")
    .max(50000, "Amount cannot exceed ₹50,000")
    .nullable(),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
});

type SendMoneyFormValues = z.infer<typeof sendMoneySchema>;

interface SendMoneyProps {
  userId: string;
}

export const SendMoney = ({ userId }: SendMoneyProps) => {
  const form = useForm<SendMoneyFormValues>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      email: "",
      amount: null,
    },
  });

  const onSubmit = async (values: SendMoneyFormValues) => {
    try {
      if (!values.amount) {
        return alert("amount is required");
      }

      const response = await axios.post(`/api/p2ptransfer/${userId}`, values);
      console.log("response", response);

      if (response.status === 200) {
        alert(`Payment Done`);
      }
    } catch (error) {
      console.log("SendMoney_Submit_Error", error);
    }
  };

  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Send Money
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          min={1}
                          step={1}
                          type="string"
                          placeholder="Enter email"
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="text-lg"
                        />
                      </FormControl>
                      <FormDescription>Enter email of reciever</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input
                          min={1}
                          step={1}
                          type="number"
                          placeholder="Enter amount"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value === ""
                                ? null
                                : parseFloat(e.target.value)
                            )
                          }
                          className="text-lg"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter amount between ₹1 and ₹50,000
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full text-lg py-6">
                  Send Money
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

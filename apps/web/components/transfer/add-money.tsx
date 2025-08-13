"use client";

import React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Button } from "@workspace/ui/components/button";
import axios from "axios";
import { createOnRampTransaction } from "@/lib/actions/createOnRampTransaction";

const addMoneySchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .min(1, "Amount must be at least ₹1")
    .max(50000, "Amount cannot exceed ₹50,000")
    .nullable(),
  bank: z
    .string({
      required_error: "Please select a bank",
    })
    .min(1, "Bank selection is required"),
});

type AddMoneyFormValues = z.infer<typeof addMoneySchema>;

const banks = [
  { value: "sbi", label: "State Bank of India", url: "https://sbi.co.in/" },
  { value: "hdfc", label: "HDFC Bank", url: "https://netbanking.hdfcbank.com" },
  { value: "icici", label: "ICICI Bank", url: "https://www.icicibank.com/" },
  { value: "axis", label: "Axis Bank", url: "https://www.axisbank.com/" },
  {
    value: "kotak",
    label: "Kotak Mahindra Bank",
    url: "https://www.kotak.com/",
  },
];

interface AddMoneyProps {
  userId: string;
}

export const AddMoney = ({ userId }: AddMoneyProps) => {
  const form = useForm<AddMoneyFormValues>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      amount: null,
      bank: "",
    },
  });

  const onSubmit = async (values: AddMoneyFormValues) => {
    try {
      if (!values.amount) {
        return alert("amount is required");
      }
      const url = banks.find((bank) => bank.value === values.bank)?.url;

      const tokenData = await axios.get(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/${values.bank}`,
        {
          params: { userId, amount: values.amount },
        }
      );

      await createOnRampTransaction({
        provider: values.bank,
        amount: values.amount,
        token: tokenData.data.token,
      });

      const token = tokenData.data.token;

      await axios.post(
        `${process.env.NEXT_PUBLIC_WEBHOOK_URL}/${values.bank}`,
        {
          token,
        }
      );

      window.location.href = url || "";
    } catch (error) {
      console.log("AddMoney_Submit_Error", error);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Add Money to Wallet
          </CardTitle>
          <CardDescription className="text-center">
            Add funds to your wallet using your preferred bank
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-6">
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

                {/* Bank */}
                <FormField
                  control={form.control}
                  name="bank"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bank</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your bank" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {banks.map((bank) => (
                            <SelectItem key={bank.value} value={bank.value}>
                              {bank.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose the bank for the transaction
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button type="submit" className="w-full text-lg py-6">
                  Add Money to Wallet
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

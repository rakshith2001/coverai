"use client"
import React, { use } from 'react'
import { any } from 'zod'
import Header from '@/components/shared/Header'
import { getProfileByParams, updateProfileByParams } from '@/lib/actions/profile.actions'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter } from "next/router"
import { useState, useEffect } from "react"
import Link from 'next/link'
import { useToast } from '@/components/ui/use-toast'; 

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { CustomField } from "@/components/shared/CustomField"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"

import { Input } from "@/components/ui/input"
import { Description } from "@radix-ui/react-dialog"

const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    workExperience: z.string().nonempty("Work Experience is required"),
    description: z.string().nonempty("Description is required"),
})

const UpdateProfile = ({ params: { id } }: SearchParamProps) => {
  const { toast } = useToast()
  const [profile, setProfile] = useState({ name: '', workExperience: '', description: '' })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: profile,
  })

  const findProfile = async () => {
    const profileData = await getProfileByParams(id)
    setProfile(profileData)
    form.reset(profileData)
  }

  useEffect(() => {
    findProfile()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const updatedProfile = await updateProfileByParams(id, values)
    // handle the response or redirection after successful update
    if (updatedProfile) {
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        duration: 5000,
        className: 'success-toast'
      });
      // handle the response or redirection after successful update
    }
    else{
      toast({
        title: "Profile Update Failed",
        description: "Your profile could not be updated.",
        duration: 5000,
        className: 'error-toast'
      
      })
    }
    
  }

  return (
    <>
      <Header
        title='Update Profile'
        subtitle='Your profile information'
      />
      <section className="mt-10">
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-wrap -mx-2">
              <div className="w-1/2 px-2">
                <CustomField
                  control={form.control}
                  name="name"
                  formLabel="Name"
                  className="w-full"
                  render={({ field }) => <Input {...field} className="input-field" />}
                />
              </div>
              <div className="w-1/2 px-2">
                <CustomField
                  control={form.control}
                  name="workExperience"
                  formLabel="Work Experience"
                  className="w-full"
                  render={({ field }) => <Input {...field} className="input-field" />}
                />
              </div>
              <div className="w-full px-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little bit about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <button type="submit" className="submit-button capitalize">Submit</button>
          </form>
        </Form>
      </section>
    </>
  )
}

export default UpdateProfile

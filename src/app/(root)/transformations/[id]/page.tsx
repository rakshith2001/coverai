"use client"

import React, { useState, useEffect } from 'react'
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/router"
import Header from '@/components/shared/Header'
import { getProfileByParams, updateProfileByParams } from '@/lib/actions/profile.actions'
import { useToast } from '@/components/ui/use-toast'
import { Input } from "@/components/ui/input"
import { Textarea } from '@/components/ui/textarea'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { CustomField } from "@/components/shared/CustomField"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { aspectRatioOptions, creditFee, defaultValues, transformationTypes } from "@/constants"
import { Button } from "@/components/ui/button"

interface SearchParamProps {
    params: {
        id: string;
    };
}

const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    workExperience: z.string().nonempty("Work Experience is required"),
    description: z.string().nonempty("Description is required"),
})

const UpdateProfile = ({ params: { id } }: SearchParamProps) => {
    const { toast } = useToast()
    const [profile, setProfile] = useState(null)
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            workExperience: '',
            description: ''
        },
    })

    useEffect(() => {
        const findProfile = async () => {
            try {
                const profileData = await getProfileByParams(id)
                setProfile(profileData)
                form.reset(profileData)
            } catch (error) {
                console.error("Error fetching profile:", error)
            }
        }
        findProfile()
    }, [id, form])

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const updatedProfile = await updateProfileByParams(id, values)
            if (updatedProfile) {
                toast({
                    title: "Profile Updated",
                    description: "Your profile has been successfully updated.",
                    duration: 5000,
                    className: 'success-toast'
                })
            } else {
                toast({
                    title: "Profile Update Failed",
                    description: "Your profile could not be updated.",
                    duration: 5000,
                    className: 'error-toast'
                })
            }
        } catch (error) {
            console.error("Error updating profile:", error)
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
            <Header title='Update Profile' subtitle='Your profile information' />
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
                                            <FormLabel>Description</FormLabel>
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
                        <Button type="submit" className="submit-button capitalize">Submit</Button>
                    </form>
                </Form>
            </section>
        </>
    )
}

export default UpdateProfile

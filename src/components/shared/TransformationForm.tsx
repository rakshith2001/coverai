"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast";

import { CustomField } from "@/components/shared/CustomField";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
    FormField
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createProfile, getProfileById } from "@/lib/actions/profile.actions";

// Define the props type
interface TransformationFormProps {
    action: 'Add' | 'Update';
    data?: {
        name: string;
        workExperience: string;
        description: string;
        publicId: string;
    } | null;
    userId: string;
    type?: string;
    creditBalance?: number;
    config?: any;
}

export const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    workExperience: z.string().nonempty("Work Experience is required"),
    description: z.string().nonempty("Description is required"),
});

const TransformationForm = ({
    action,
    data = null,
    userId,
    type,
    creditBalance,
    config = null,
}: TransformationFormProps) => {
    const [profileExists, setProfileExists] = useState(false);
    const [profileId, setProfileId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        async function checkProfile() {
            try {
                const profile = await getProfileById(userId);
                if (profile) {
                    setProfileExists(true);
                    setProfileId(profile._id);
                }
            } catch (error) {
                console.log("Profile not found, you can create one.");
            } finally {
                setLoading(false);
            }
        }
        checkProfile();
    }, [userId]);

    const initialValues = data && action === 'Update' ? {
        name: data.name,
        workExperience: data.workExperience,
        description: data.description,
        publicId: data.publicId,
    } : {
        name: '',
        workExperience: '',
        description: ''
    };

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues,
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const profile = {
            name: values.name,
            workExperience: values.workExperience,
            description: values.description,
        };

        setLoading(true);

        if (action === 'Add') {
            try {
                const newProfile = await createProfile({ profile, userId });

                if (newProfile) {
                    form.reset();
                    console.log("Profile created successfully");
                    toast({
                        title: "Profile Created",
                        description: "Your profile has been successfully created.",
                        duration: 5000,
                        className: 'success-toast'
                    });

                    const profile = await getProfileById(userId);
                    if (profile) {
                        setProfileExists(true);
                        setProfileId(profile._id);
                    }
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        }
    }

    if (loading) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold">Loading...</h2>
            </div>
        );
    }

    if (profileExists) {
        return (
            <div className="text-center">
                <h2 className="text-2xl font-semibold">You already have a profile</h2>
                <p className="mt-2">You can only have one profile at a time</p>
                {profileId && (
                    <Link href={`/transformations/${profileId}`} className="mt-4 ">
                        <Button  className="mt-3   bg-blue-500 capitalize">Edit Profile</Button>
                    </Link>
                )}
            </div>
        );
    }

    return (
        <>
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
                    <button type="submit" className="submit-button capitalize">Submit</button>
                </form>
            </Form>
        </>
    );
};

export default TransformationForm;

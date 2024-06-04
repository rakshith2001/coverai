"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import Profile from "../database/models/profile.model";
import { handleError } from "../utils";
import User from "../database/models/user.model";

// CREATE
export async function createProfile({ profile, userId }: { profile: any; userId: string }) {
  try {
    await connectToDatabase();
    const author = await User.findById(userId); 
    if (!author) throw new Error("User not found");

    const newProfile = await Profile.create({ ...profile, userId: author._id });

    return JSON.parse(JSON.stringify(newProfile));
  } catch (error) {
    handleError(error);
    throw new Error(`Error creating profile: ${error}`);
  }
}

// READ
export async function getProfileById(userId: string) {
  try {
    await connectToDatabase();

    const profile = await Profile.findOne({ userId });

    if (!profile) throw new Error("Profile not found");

    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    handleError(error);
  }
}

export async function getProfileByParams(_id: string) {
  try {
    await connectToDatabase();

    const profile = await Profile.findOne({ _id });

    if (!profile) throw new Error("Profile not found");

    return JSON.parse(JSON.stringify(profile));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateProfile(profileId: string, updatedData: any) {
  try {
    await connectToDatabase();

    const updatedProfile = await Profile.findByIdAndUpdate(profileId, updatedData, { new: true });

    if (!updatedProfile) throw new Error("Profile not found");

    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    handleError(error);
    throw new Error(`Error updating profile: ${error}`);
  }
}

// UPDATE BY PARAMS
export async function updateProfileByParams(profileId: string, updatedData: any) {
  try {
    await connectToDatabase();

    const updatedProfile = await Profile.findOneAndUpdate({ _id: profileId }, updatedData, { new: true });

    if (!updatedProfile) throw new Error("Profile not found");

    return JSON.parse(JSON.stringify(updatedProfile));
  } catch (error) {
    handleError(error);
    throw new Error(`Error updating profile: ${error}`);
  }
}

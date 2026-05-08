import connectDB from "@/src/lib/DBConnection";
import { auth } from "@/src/lib/auth";
import { generatePublicFeedToken } from "@/src/lib/public-feed";
import UserModel from "@/src/models/user";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await UserModel.findById(userId).select("publicFeedToken");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.publicFeedToken) {
      user.publicFeedToken = generatePublicFeedToken();
      user.publicFeedTokenCreatedAt = new Date();
      await user.save();
    }

    return NextResponse.json(
      {
        success: true,
        message: "Public feed token fetched",
        publicFeedToken: user.publicFeedToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in Public-Feed GET API", error);

    return NextResponse.json(
      { success: false, message: "Error in Public-Feed GET API" },
      { status: 500 }
    );
  }
}

export async function POST() {
  await connectDB();

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const userId = session?.user.id;

    if (!session || !userId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = generatePublicFeedToken();

    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        publicFeedToken: token,
        publicFeedTokenCreatedAt: new Date(),
      },
      { new: true }
    ).select("publicFeedToken");

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Public feed token regenerated",
        publicFeedToken: updatedUser.publicFeedToken,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in Public-Feed POST API", error);

    return NextResponse.json(
      { success: false, message: "Error in Public-Feed POST API" },
      { status: 500 }
    );
  }
}

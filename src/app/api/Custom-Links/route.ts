import connectDB from "@/src/lib/DBConnection";
import { auth } from "@/src/lib/auth";
import UserModel, { type CustomLink } from "@/src/models/user";
import {
    customLinkCreateSchema,
    customLinkDeleteSchema,
} from "@/src/velidationSchemas/customLinkSchema";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { randomBytes } from "crypto";

const MAX_CUSTOM_LINKS = 2;

function createSlugBase(value: string) {
    const base = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");

    return base || "product";
}

function createUniqueSlug(base: string) {
    const suffix = randomBytes(3).toString("hex");
    return `${base}-${suffix}`;
}

function toCustomLinkResponse(customLink: {
    _id?: mongoose.Types.ObjectId;
    productName: string;
    slug: string;
    createdAt: Date;
}) {
    return {
        id: String(customLink._id),
        productName: customLink.productName,
        slug: customLink.slug,
        createdAt: customLink.createdAt,
    };
}

export async function GET() {
    await connectDB();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const userId = session?.user.id;

        if (!session || !userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const user = await UserModel.findById(userId).select("customLinks");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const customLinks = user.customLinks
            .filter((link: CustomLink) => link.isActive !== false)
            .sort(
                (a: CustomLink, b: CustomLink) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            )
            .map((link: CustomLink) => toCustomLinkResponse(link));

        return NextResponse.json(
            {
                success: true,
                message: "Custom links fetched successfully",
                customLinks,
                maxCustomLinks: MAX_CUSTOM_LINKS,
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in Custom-Links GET API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Custom-Links GET API",
            },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    await connectDB();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const userId = session?.user.id;

        if (!session || !userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parsedBody = customLinkCreateSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid request body",
                },
                { status: 400 }
            );
        }

        const productName = parsedBody.data.productName.trim();

        const user = await UserModel.findById(userId).select("customLinks");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const activeCustomLinks = user.customLinks.filter(
            (link: CustomLink) => link.isActive !== false
        );

        if (activeCustomLinks.length >= MAX_CUSTOM_LINKS) {
            return NextResponse.json(
                {
                    success: false,
                    message: `You can create up to ${MAX_CUSTOM_LINKS} custom links only`,
                },
                { status: 400 }
            );
        }

        const slugBase = createSlugBase(productName);
        const existingSlugs = new Set(activeCustomLinks.map((link: CustomLink) => link.slug));

        let slug = "";
        for (let attempt = 0; attempt < 6; attempt++) {
            const candidate = createUniqueSlug(slugBase);
            if (!existingSlugs.has(candidate)) {
                slug = candidate;
                break;
            }
        }

        if (!slug) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Could not generate unique link slug",
                },
                { status: 500 }
            );
        }

        user.customLinks.push({
            productName,
            slug,
            isActive: true,
            createdAt: new Date(),
        });

        await user.save();

        const createdLink = user.customLinks[user.customLinks.length - 1];

        return NextResponse.json(
            {
                success: true,
                message: "Custom link created successfully",
                customLink: toCustomLinkResponse(createdLink),
                remainingSlots: MAX_CUSTOM_LINKS - (activeCustomLinks.length + 1),
                maxCustomLinks: MAX_CUSTOM_LINKS,
            },
            { status: 201 }
        );
    } catch (error) {
        console.log("Error in Custom-Links POST API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Custom-Links POST API",
            },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    await connectDB();

    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const userId = session?.user.id;

        if (!session || !userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const parsedBody = customLinkDeleteSchema.safeParse(body);

        if (!parsedBody.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: parsedBody.error.issues[0]?.message || "Invalid request body",
                },
                { status: 400 }
            );
        }

        const { linkId } = parsedBody.data;

        if (!mongoose.Types.ObjectId.isValid(linkId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid link id",
                },
                { status: 400 }
            );
        }

        const linkObjectId = new mongoose.Types.ObjectId(linkId);

        const user = await UserModel.findById(userId).select("customLinks");

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found",
                },
                { status: 404 }
            );
        }

        const customLink = user.customLinks.find(
            (link: CustomLink) => String(link._id) === linkId && link.isActive !== false
        );

        if (!customLink) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Custom link not found",
                },
                { status: 404 }
            );
        }

        await UserModel.findByIdAndUpdate(
            userId,
            {
                $pull: {
                    customLinks: { _id: linkObjectId },
                    messages: { customLinkId: linkObjectId },
                },
            },
            { new: false }
        );

        return NextResponse.json(
            {
                success: true,
                message: "Custom link deleted successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("Error in Custom-Links DELETE API", error);

        return NextResponse.json(
            {
                success: false,
                message: "Error in Custom-Links DELETE API",
            },
            { status: 500 }
        );
    }
}

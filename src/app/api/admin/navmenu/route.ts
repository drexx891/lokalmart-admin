import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const prismaNavMenu = (prisma as any).navigationMenu;
        if (!prismaNavMenu) return NextResponse.json([]);

        const menus = await prismaNavMenu.findMany({
            orderBy: { position: "asc" }
        });
        return NextResponse.json(menus);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const prismaNavMenu = (prisma as any).navigationMenu;
        
        if (!data.title || !data.iconUrl || !data.href) {
            return NextResponse.json({ error: "Title, Icon URL, and Href are required" }, { status: 400 });
        }

        const menu = await prismaNavMenu.create({
            data: {
                title: data.title,
                iconUrl: data.iconUrl,
                href: data.href,
                position: data.position || 0,
                isActive: data.isActive !== undefined ? data.isActive : true
            }
        });
        return NextResponse.json(menu);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const data = await req.json();
        const { id, ...updateData } = data;
        const prismaNavMenu = (prisma as any).navigationMenu;
        
        if (!id) {
            return NextResponse.json({ error: "Menu ID is required" }, { status: 400 });
        }

        const menu = await prismaNavMenu.update({
            where: { id },
            data: updateData
        });
        return NextResponse.json(menu);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        const prismaNavMenu = (prisma as any).navigationMenu;

        if (!id) {
            return NextResponse.json({ error: "Menu ID is required" }, { status: 400 });
        }

        await prismaNavMenu.delete({
            where: { id }
        });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

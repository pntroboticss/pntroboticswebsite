import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import HardwareModel from "@/lib/models/HardwareModel";

// GET all active hardware models
export async function GET() {
    try {
        await dbConnect();
        const models = await HardwareModel.find({ active: true }).sort({ sortOrder: 1, createdAt: 1 });
        return NextResponse.json(models);
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST — create a new hardware model entry
export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();

        if (!body.name || !body.modelPath) {
            return NextResponse.json({ success: false, message: "Name and model path are required" }, { status: 400 });
        }

        const newModel = await HardwareModel.create({
            name: body.name,
            description: body.description || "",
            modelPath: body.modelPath,
            active: body.active !== false,
            sortOrder: body.sortOrder || 0,
        });

        return NextResponse.json({ success: true, data: newModel }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE — remove a hardware model entry
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        await dbConnect();
        const deleted = await HardwareModel.findByIdAndDelete(id);

        if (!deleted) {
            return NextResponse.json({ success: false, message: "Model not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Hardware model deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PATCH — toggle active / update
export async function PATCH(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
        }

        await dbConnect();
        const body = await req.json();
        const updated = await HardwareModel.findByIdAndUpdate(id, { $set: body }, { new: true });

        if (!updated) {
            return NextResponse.json({ success: false, message: "Model not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: updated });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { imageUploadSchema } from "@/lib/validators/schemas";

const MAX_FILE_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/avif"];
const BUCKET = "vehicle-images";

// POST /api/upload — upload a vehicle image (admin only)
export async function POST(request: NextRequest) {
  const supabase = await createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ data: null, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const metaRaw = formData.get("meta") as string | null;

  if (!file) {
    return NextResponse.json({ data: null, error: { message: "No file provided" } }, { status: 400 });
  }

  // Validate file type
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { data: null, error: { message: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF" } },
      { status: 400 }
    );
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { data: null, error: { message: "File too large. Maximum size is 8 MB." } },
      { status: 400 }
    );
  }

  // Parse and validate metadata
  let meta: Record<string, unknown> = {};
  if (metaRaw) {
    try {
      meta = JSON.parse(metaRaw);
    } catch {
      return NextResponse.json({ data: null, error: { message: "Invalid metadata JSON" } }, { status: 400 });
    }
  }

  const parse = imageUploadSchema.safeParse(meta);
  if (!parse.success) {
    return NextResponse.json(
      { data: null, error: { message: parse.error.issues[0].message } },
      { status: 400 }
    );
  }

  const { vehicle_id, color_id, wheel_id, interior_id, view_type, alt_text } = parse.data;

  // Build storage path: vehicle-images/{vehicleId}/{view_type}/{timestamp}.{ext}
  const ext = file.name.split(".").pop() ?? "jpg";
  const timestamp = Date.now();
  const storagePath = `${vehicle_id}/${view_type}/${timestamp}.${ext}`;

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ data: null, error: { message: uploadError.message } }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  // Insert record in vehicle_images table
  const { data, error } = await supabase
    .from("vehicle_images")
    .insert({
      vehicle_id,
      color_id: color_id ?? null,
      wheel_id: wheel_id ?? null,
      interior_id: interior_id ?? null,
      view_type,
      image_url: imageUrl,
      alt_text: alt_text ?? null,
    })
    .select()
    .single();

  if (error) {
    // Attempt to clean up the uploaded file if DB insert fails
    await supabase.storage.from(BUCKET).remove([storagePath]);
    return NextResponse.json({ data: null, error: { message: error.message } }, { status: 500 });
  }

  return NextResponse.json({ data, error: null }, { status: 201 });
}

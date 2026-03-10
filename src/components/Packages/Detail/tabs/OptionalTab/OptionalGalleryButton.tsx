import { FaImages } from "react-icons/fa";
import ImageGalleryModal from "../../ImageGalleryModal";
import { useState } from "react";
import { OptionalActivity } from "@/types/activities";

interface GalleryButtonProps {
  activity: OptionalActivity;
}

export default function OptionalGalleryButton({ activity }: GalleryButtonProps) {
  const [open, setOpen] = useState(false);

  const allImages = [
    activity.cover_image,
    ...(activity.photos ?? []),
  ].filter(Boolean) as string[];

  if (allImages.length === 0) return null;

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        type="button"
        className=""
      >
        <FaImages className="w-3.5 h-3.5 flex-shrink-0" />
        Ver fotos · {allImages.length}
      </button>

      <ImageGalleryModal
        headless
        images={allImages}
        title={activity.name}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
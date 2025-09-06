import { StarIcon } from "lucide-react";
import { Button } from "../ui/button";

function StarRatingComponent({ rating, handleRatingChange, size = "md" }) {
  const sizeClasses = {
    sm: "w-3 h-3", // ~12px
    md: "w-5 h-5", // ~20px
    lg: "w-6 h-6", // ~24px
  };

  return [1, 2, 3, 4, 5].map((star) => {
    const isActive = star <= rating;

    // If interactive -> render button
    if (handleRatingChange) {
      return (
        <Button
          key={star}
          className="rounded-full transition-colors"
          variant="outline"
          size="icon"
          onClick={() => handleRatingChange(star)}
        >
          <StarIcon
            className={`${sizeClasses[size]} ${
              isActive ? "fill-yellow-500 text-yellow-500" : "fill-black text-black"
            }`}
          />
        </Button>
      );
    }

    // Otherwise just render plain star (smaller, no button padding)
    return (
      <StarIcon
        key={star}
        className={`${sizeClasses[size]} ${
          isActive ? "fill-yellow-500 text-yellow-500" : "fill-black text-black"
        }`}
      />
    );
  });
}

export default StarRatingComponent;

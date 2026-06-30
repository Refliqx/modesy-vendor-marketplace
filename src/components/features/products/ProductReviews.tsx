"use client";

import { useState, useEffect } from "react";
import { Star, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { submitReview, checkReviewEligibility } from "@/actions/review.actions";
import { useCartStore } from "@/stores/useCartStore";

interface ReviewUser {
  full_name: string;
  avatar_url: string | null;
}

interface ReviewItem {
  id: number;
  rating: number;
  review: string | null;
  created_at: string | null;
  profiles?: ReviewUser | null;
}

interface ProductReviewsProps {
  productId: number;
  initialReviews: ReviewItem[];
}

function formatRelativeTime(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${diffMonths}mo ago`;
}

export function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>(initialReviews);
  const user = useCartStore((s) => s.user);
  const [eligibility, setEligibility] = useState({ eligible: false, reviewed: false });
  const [loadingElig, setLoadingElig] = useState(true);

  // Form states
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Check eligibility on user or reviews change
  useEffect(() => {
    if (user) {
      setLoadingElig(true);
      checkReviewEligibility(productId)
        .then((res) => {
          setEligibility(res);
        })
        .finally(() => {
          setLoadingElig(false);
        });
    } else {
      setEligibility({ eligible: false, reviewed: false });
      setLoadingElig(false);
    }
  }, [user, productId, reviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitReview({
        productId,
        rating,
        review: comment.trim() || null,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success(res.updated ? "Review updated successfully!" : "Review submitted successfully!");
        setComment("");
        // Refresh reviews list locally
        // Fetch new reviews list from client
        const supabase = user
          ? (await import("@/lib/supabase/client")).createClient()
          : null;
        if (supabase) {
          const { data } = await supabase
            .from("product_reviews")
            .select("*, profiles(full_name, avatar_url)")
            .eq("product_id", productId)
            .order("created_at", { ascending: false });
          if (data) {
            setReviews(data as any);
          }
        }
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  // Compute metrics
  const totalReviews = reviews.length;
  const ratingAverage =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  const starPercentages = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => r.rating === stars).length;
    return {
      stars,
      count,
      percent: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    };
  });

  return (
    <div id="reviews" className="w-full mt-10 border-t border-gray-100 pt-10 select-none">
      <h2 className="text-xl font-bold text-[#1F2937] mb-6 font-sans">
        Customer Reviews ({totalReviews})
      </h2>

      {/* Aggregate metrics */}
      <div className="grid md:grid-cols-3 gap-8 items-center bg-gray-50/50 rounded-xl p-6 border border-gray-100 mb-10">
        {/* Average column */}
        <div className="flex flex-col items-center md:items-start md:border-r border-gray-100 md:pe-8">
          <span className="text-5xl font-extrabold text-[#1F2937] font-sans">
            {ratingAverage > 0 ? ratingAverage.toFixed(1) : "0.0"}
          </span>
          <div className="flex items-center gap-0.5 mt-2 mb-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={18}
                className={cn(
                  "stroke-none",
                  i < Math.round(ratingAverage) ? "fill-yellow-400" : "fill-gray-200"
                )}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 font-sans font-medium">
            Based on {totalReviews} reviews
          </span>
        </div>

        {/* Bars column */}
        <div className="col-span-2 flex flex-col gap-2">
          {starPercentages.map(({ stars, count, percent }) => (
            <div key={stars} className="flex items-center gap-3 text-sm">
              <span className="w-8 text-gray-500 font-medium font-sans flex items-center justify-end gap-1">
                {stars} <Star size={12} className="fill-gray-400 stroke-none mb-0.5" />
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <span className="w-12 text-gray-400 font-medium font-sans">
                {percent.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews list */}
      <div className="flex flex-col gap-6">
        {reviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg border border-gray-100 text-gray-400">
            <MessageSquare size={36} className="text-gray-300 mb-2" />
            <p className="text-sm font-sans">No reviews yet for this product.</p>
          </div>
        ) : (
          reviews.map((r) => {
            const initials = r.profiles?.full_name
              ? r.profiles.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()
              : "U";

            return (
              <div key={r.id} className="pb-6 border-b border-gray-100 last:border-b-0 flex gap-4">
                {/* User avatar / initial */}
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 uppercase select-none">
                  {r.profiles?.avatar_url ? (
                    <img
                      src={r.profiles.avatar_url}
                      alt={r.profiles.full_name}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* Review body */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#1F2937] font-sans">
                      {r.profiles?.full_name || "User"}
                    </h4>
                    <span className="text-xs text-gray-400 font-sans">
                      {formatRelativeTime(r.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 my-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={cn(
                          "stroke-none",
                          i < r.rating ? "fill-yellow-400" : "fill-gray-200"
                        )}
                      />
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 font-sans leading-relaxed whitespace-pre-line">
                    {r.review || <span className="text-gray-400 italic">No comment provided.</span>}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Leave review section */}
      {!loadingElig && eligibility.eligible && (
        <form
          onSubmit={handleSubmit}
          className="mt-10 border-t border-gray-100 pt-10 flex flex-col gap-4 max-w-xl"
        >
          <h3 className="text-lg font-bold text-[#1F2937] font-sans">
            {eligibility.reviewed ? "Update your review" : "Leave a review"}
          </h3>
          <p className="text-xs text-gray-400 -mt-2 font-sans">
            You purchased this item. Your review will help other shoppers make better decisions.
          </p>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-[#1F2937] font-sans">Rating</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(null)}
                  className="p-1 cursor-pointer outline-none"
                >
                  <Star
                    size={24}
                    className={cn(
                      "transition-colors stroke-none",
                      star <= (hoveredRating ?? rating) ? "fill-yellow-400" : "fill-gray-200"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-[#1F2937] font-sans" htmlFor="review-comment">
              Comment (Optional)
            </label>
            <textarea
              id="review-comment"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              className="w-full border border-gray-200 rounded-md p-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-fit bg-primary text-white font-semibold text-sm px-6 h-11 rounded-md hover:bg-primary-hover transition-colors cursor-pointer outline-none flex items-center gap-2"
          >
            {submitting ? "Submitting..." : eligibility.reviewed ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
}

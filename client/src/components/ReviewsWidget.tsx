import { useEffect, useState } from 'react';
import { Star, ThumbsUp, ThumbsDown, MessageCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';

const reviewSchema = z.object({
  authorName: z.string().min(2, 'Ime mora imati najmanje 2 karaktera'),
  authorEmail: z.string().email('Unesite validan email').optional().or(z.literal('')),
  rating: z.number().min(1).max(5),
  title: z.string().min(5, 'Naslov mora imati najmanje 5 karaktera'),
  content: z.string().min(10, 'Review mora imati najmanje 10 karaktera'),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

export function ReviewsWidget() {
  const [selectedRating, setSelectedRating] = useState(5);
  const [formData, setFormData] = useState<ReviewFormData>({
    authorName: '',
    authorEmail: '',
    rating: 5,
    title: '',
    content: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOpen, setIsOpen] = useState(false);

  const { data: stats } = trpc.reviews.getStats.useQuery();
  const { data: reviews, isLoading } = trpc.reviews.getApproved.useQuery({
    limit: 10,
    offset: 0,
  });
  const submitReview = trpc.reviews.submit.useMutation();
  const markHelpful = trpc.reviews.markHelpful.useMutation();

  const handleSubmitReview = async () => {
    try {
      const validated = reviewSchema.parse(formData);
      await submitReview.mutateAsync(validated);
      setFormData({
        authorName: '',
        authorEmail: '',
        rating: 5,
        title: '',
        content: '',
      });
      setErrors({});
      setIsOpen(false);
      alert('Hvala na vašem review-u! Bit će objavljen nakon provjere.');
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        (error as z.ZodError).issues.forEach((issue: any) => {
          const path = issue.path[0];
          if (path) newErrors[path.toString()] = issue.message;
        });
        setErrors(newErrors);
      }
    }
  };

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-slate-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">Što misle naši korisnici?</h2>
          <p className="text-lg text-slate-600">Pročitajte iskustva drugih korisnika Majstori Split</p>
        </div>

        {/* Stats Section */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Average Rating */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-5xl font-bold text-slate-900 mb-2">{stats.averageRating}</div>
              <div className="flex justify-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    className={i < Math.round(parseFloat(stats.averageRating as string)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}
                  />
                ))}
              </div>
              <p className="text-slate-600">Prosječna ocjena</p>
            </div>

            {/* Total Reviews */}
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-5xl font-bold text-slate-900 mb-2">{stats.totalReviews}</div>
              <p className="text-slate-600 mb-3">Ukupno review-a</p>
              <p className="text-sm text-slate-500">Od prije 2 godine</p>
            </div>

            {/* Rating Distribution */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <p className="text-sm font-semibold text-slate-900 mb-3">Distribucija ocjena</p>
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-slate-600 w-6">{rating}★</span>
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400"
                      style={{
                        width: `${
                          stats.totalReviews > 0
                            ? (stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution] / stats.totalReviews) * 100
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-8 text-right">
                    {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Review Button */}
        <div className="text-center mb-12">
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <MessageCircle className="mr-2" size={20} />
                Napišite review
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Napišite review</DialogTitle>
                <DialogDescription>Podijelite svoje iskustvo s Majstori Split</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {/* Rating Selection */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-2 block">Ocjena</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => {
                          setSelectedRating(rating);
                          setFormData({ ...formData, rating });
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Star
                          size={28}
                          className={
                            rating <= selectedRating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-1 block">Ime</label>
                  <Input
                    placeholder="Vaše ime"
                    value={formData.authorName}
                    onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                    className={errors.authorName ? 'border-red-500' : ''}
                  />
                  {errors.authorName && <p className="text-xs text-red-500 mt-1">{errors.authorName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-1 block">Email (opcionalno)</label>
                  <Input
                    type="email"
                    placeholder="vase@email.com"
                    value={formData.authorEmail}
                    onChange={(e) => setFormData({ ...formData, authorEmail: e.target.value })}
                    className={errors.authorEmail ? 'border-red-500' : ''}
                  />
                  {errors.authorEmail && <p className="text-xs text-red-500 mt-1">{errors.authorEmail}</p>}
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-1 block">Naslov</label>
                  <Input
                    placeholder="Sažetak vašeg iskustva"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>

                {/* Content */}
                <div>
                  <label className="text-sm font-semibold text-slate-900 mb-1 block">Review</label>
                  <Textarea
                    placeholder="Opišite vaše iskustvo..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className={errors.content ? 'border-red-500' : ''}
                    rows={4}
                  />
                  {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={submitReview.isPending}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  {submitReview.isPending ? 'Slanje...' : 'Pošalji review'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-slate-500">Učitavanje review-a...</div>
          ) : reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-slate-900">{review.authorName}</h3>
                      {review.verified && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString('hr-HR')}
                  </span>
                </div>

                {/* Title and Content */}
                <h4 className="font-semibold text-slate-900 mb-2">{review.title}</h4>
                <p className="text-slate-700 text-sm mb-4">{review.content}</p>

                {/* Helpful Buttons */}
                <div className="flex gap-3 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => markHelpful.mutate({ reviewId: review.id, helpful: true })}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    <ThumbsUp size={14} />
                    Korisno ({review.helpful})
                  </button>
                  <button
                    onClick={() => markHelpful.mutate({ reviewId: review.id, helpful: false })}
                    className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 transition"
                  >
                    <ThumbsDown size={14} />
                    Nije korisno ({review.unhelpful})
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-slate-500">Nema review-a za prikaz</div>
          )}
        </div>
      </div>
    </div>
  );
}

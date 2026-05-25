import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, Send, User, Calendar, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
  isCustom?: boolean; // indicates review was written by the user
}

interface ReviewSectionProps {
  destinationId: string;
  destinationName: string;
}

// Generate some authentic seed reviews based on destination ID / name
const getSeedReviews = (destId: string, destName: string): Review[] => {
  if (destId.includes('pantai') || destName.toLowerCase().includes('pantai')) {
    return [
      {
        id: `${destId}-seed-1`,
        author: 'Rian Saputra',
        rating: 5,
        comment: 'Air lautnya luar biasa jernih dengan hamparan pasir putih yang sangat halus. Formasi batuan granitnya sangat mengagumkan dan estetik untuk berfoto!',
        date: '2026-05-10',
      },
      {
        id: `${destId}-seed-2`,
        author: 'Siti Rahma',
        rating: 4,
        comment: 'Pemandangan alam yang sangat menenangkan. Sangat disarankan datang saat sore hari sekitar jam 16.30 WIB untuk menikmati embusan angin sejuk bertiup dari laut.',
        date: '2026-05-18',
      }
    ];
  } else if (destId.includes('resto') || destName.toLowerCase().includes('otak') || destName.toLowerCase().includes('mie') || destName.toLowerCase().includes('lempah')) {
    return [
      {
        id: `${destId}-seed-1`,
        author: 'Hendra Wijaya',
        rating: 5,
        comment: 'Cita rasa kuliner lokal yang benar-benar otentik dan tiada duanya! Olahan ikannya sangat segar, bumbu rempahnya begitu meresap gurih di lidah.',
        date: '2026-04-28',
      },
      {
        id: `${destId}-seed-2`,
        author: 'Dewi Lestari',
        rating: 5,
        comment: 'Porsi melimpah dengan kualitas premium. Sambalnya mantap dan saus celupnya khas sekali. Wajib mampir bersama keluarga jika ke Bangka Belitung!',
        date: '2026-05-15',
      }
    ];
  } else {
    // Cafe / default
    return [
      {
        id: `${destId}-seed-1`,
        author: 'Alif Ramadhan',
        rating: 5,
        comment: 'Tempat kumpul yang sangat nyaman dan estetik. Seduhan kopi dengan teknik tradisionalnya sangat wangi, dipadu roti panggang yang manisnya pas.',
        date: '2026-05-02',
      },
      {
        id: `${destId}-seed-2`,
        author: 'Nabila Putri',
        rating: 4,
        comment: 'Suasana yang santai dengan pelayanan ramah. Cocok sekali untuk merilekskan pikiran di sore hari atau bekerja santai (WFH) sambil minum kopi.',
        date: '2026-05-20',
      }
    ];
  }
};

export default function ReviewSection({ destinationId, destinationName }: ReviewSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  
  // Form States
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Load reviews from local storage or seeds
  useEffect(() => {
    const savedReviewsMap = localStorage.getItem('localtrip_destination_reviews');
    let reviewsMap: Record<string, Review[]> = {};
    if (savedReviewsMap) {
      try {
        reviewsMap = JSON.parse(savedReviewsMap);
      } catch (e) {
        // ignore
      }
    }

    if (reviewsMap[destinationId]) {
      setReviews(reviewsMap[destinationId]);
    } else {
      const seeds = getSeedReviews(destinationId, destinationName);
      setReviews(seeds);
      // Persist seeds
      reviewsMap[destinationId] = seeds;
      localStorage.setItem('localtrip_destination_reviews', JSON.stringify(reviewsMap));
    }

    // Pre-fill author if logged in
    const loggedInUserStr = localStorage.getItem('localtrip_current_user');
    if (loggedInUserStr) {
      try {
        const user = JSON.parse(loggedInUserStr);
        if (user && user.name) {
          setAuthor(user.name);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [destinationId, destinationName]);

  // Sync author name with current logged-in user changes dynamically
  useEffect(() => {
    const checkUser = () => {
      const loggedInUserStr = localStorage.getItem('localtrip_current_user');
      if (loggedInUserStr) {
        try {
          const user = JSON.parse(loggedInUserStr);
          if (user && user.name) {
            setAuthor(user.name);
          }
        } catch (e) {
          // ignore
        }
      }
    };
    window.addEventListener('storage', checkUser);
    // Also check on modal toggle triggers or component renders
    checkUser();
    return () => window.removeEventListener('storage', checkUser);
  }, [isExpanded]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setSubmitSuccess(false);

    if (!author.trim()) {
      setSubmitError('Harap isi Nama Anda.');
      return;
    }
    if (!comment.trim()) {
      setSubmitError('Harap tuliskan ulasan/ulasan teks Anda.');
      return;
    }

    const newReview: Review = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      author: author.trim(),
      rating,
      comment: comment.trim(),
      date: new Date().toISOString().split('T')[0],
      isCustom: true
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);

    // Save back to local storage
    const savedReviewsMap = localStorage.getItem('localtrip_destination_reviews');
    let reviewsMap: Record<string, Review[]> = {};
    if (savedReviewsMap) {
      try {
        reviewsMap = JSON.parse(savedReviewsMap);
      } catch (e) {
        // ignore
      }
    }
    reviewsMap[destinationId] = updatedReviews;
    localStorage.setItem('localtrip_destination_reviews', JSON.stringify(reviewsMap));

    // Reset Form (except author)
    setComment('');
    setRating(5);
    setSubmitSuccess(true);
    setTimeout(() => setSubmitSuccess(false), 2000);
  };

  const handleDeleteReview = (reviewId: string) => {
    const updatedReviews = reviews.filter(r => r.id !== reviewId);
    setReviews(updatedReviews);

    const savedReviewsMap = localStorage.getItem('localtrip_destination_reviews');
    let reviewsMap: Record<string, Review[]> = {};
    if (savedReviewsMap) {
      try {
        reviewsMap = JSON.parse(savedReviewsMap);
      } catch (e) {
        // ignore
      }
    }
    reviewsMap[destinationId] = updatedReviews;
    localStorage.setItem('localtrip_destination_reviews', JSON.stringify(reviewsMap));
  };

  // Calculate dynamic average rating of current loaded reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div id={`review-sec-${destinationId}`} className="border-t border-gray-100 bg-slate-50/50 mt-1 select-none">
      
      {/* Header Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-700 hover:bg-slate-100/60 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
          <span>Ulasan Pengguna ({reviews.length})</span>
          <div className="flex items-center gap-0.5 bg-amber-50 border border-amber-200/60 text-amber-800 px-1.5 py-0.2 rounded-sm text-[10px] scale-95 font-mono">
            ⭐ {averageRating}
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-slate-400 font-normal">
          <span className="text-[10.5px] font-medium">{isExpanded ? 'Tutup' : 'Lihat'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded Content with Reviews and Submission form */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-1 space-y-4 animate-fade-in text-left">
          
          {/* List of existing comments */}
          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-0.5 divide-y divide-gray-100">
            {reviews.length === 0 ? (
              <p className="text-[10.5px] text-slate-400 italic text-center py-4">Belum ada ulasan untuk tempat ini. Jadilah yang pertama memberikan ulasan!</p>
            ) : (
              reviews.map((rev, index) => (
                <div key={rev.id} className={`pt-2.5 pb-1 text-xs ${index === 0 ? 'border-none' : ''}`}>
                  <div className="flex items-center justify-between gap-1.5 mb-1">
                    <div className="flex items-center gap-1">
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center font-bold text-[9px] text-slate-600 uppercase">
                        {rev.author.substring(0, 2)}
                      </div>
                      <span className="font-bold text-slate-800 text-[11px] truncate max-w-[130px]">{rev.author}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= rev.rating ? 'fill-amber-400 stroke-amber-400' : 'text-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      {rev.isCustom && (
                        <button
                          type="button"
                          onClick={() => handleDeleteReview(rev.id)}
                          className="text-rose-400 hover:text-rose-600 p-0.5 rounded cursor-pointer transition-colors"
                          title="Hapus ulasan Anda"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-sans pl-6 whitespace-pre-wrap">
                    {rev.comment}
                  </p>

                  <div className="flex items-center gap-1 text-[9px] text-slate-400 pl-6 mt-1.5">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{rev.date}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* New Review Form */}
          <form onSubmit={handleSubmit} className="bg-white border border-gray-150 rounded-xl p-3 space-y-2.5 shadow-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block border-b border-gray-100 pb-1">
              📝 Berikan Ulasan Anda:
            </span>

            {submitError && (
              <p className="text-[10px] text-rose-600 bg-rose-50 px-2 py-1 rounded-md border border-rose-100">{submitError}</p>
            )}
            {submitSuccess && (
              <p className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">Ulasan Anda sukses ditambahkan!</p>
            )}

            {/* Form Fields inside small grid */}
            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="text-[10.5px] font-medium text-slate-600">Pilih Rating:</span>
                
                {/* Rating select stars icons */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((starIdx) => (
                    <button
                      key={starIdx}
                      type="button"
                      onMouseEnter={() => setHoveredRating(starIdx)}
                      onMouseLeave={() => setHoveredRating(null)}
                      onClick={() => setRating(starIdx)}
                      className="p-0.5 cursor-pointer focus:outline-none focus:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          starIdx <= (hoveredRating ?? rating)
                            ? 'fill-amber-400 stroke-amber-400 text-amber-400'
                            : 'text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-[10.5px] font-bold font-mono text-amber-700 ml-1">
                    ({rating} Bintang)
                  </span>
                </div>
              </div>

              {/* Author name input */}
              <div>
                <input
                  type="text"
                  placeholder="Nama Anda"
                  required
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-150 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-indigo-500 font-medium text-slate-800"
                />
              </div>

              {/* Review Text Area */}
              <div>
                <textarea
                  rows={2}
                  placeholder="Tulis opini/pengalaman berkunjung Anda disini..."
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-slate-50 border border-gray-150 rounded-lg p-2 text-xs focus:outline-none focus:border-indigo-500 font-normal text-slate-800 resize-none leading-relaxed"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-extrabold py-1.5 px-3 rounded-lg flex items-center justify-center gap-1.5 cursor-pointer uppercase tracking-wider shadow-xs transition-colors"
            >
              <Send className="w-3 h-3" />
              <span>Kirimkan Ulasan</span>
            </button>
          </form>

        </div>
      )}
    </div>
  );
}

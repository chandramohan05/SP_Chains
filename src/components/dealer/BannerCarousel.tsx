import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Banner } from '../../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: unknown) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  if (loading || banners.length === 0) {
    return null;
  }

  const currentBanner = banners[currentIndex];

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden mb-6">
      {currentBanner.link_url ? (
        <a
          href={currentBanner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <img
            src={currentBanner.image_url}
            alt={currentBanner.title}
            className="w-full h-48 object-cover"
          />
        </a>
      ) : (
        <img
          src={currentBanner.image_url}
          alt={currentBanner.title}
          className="w-full h-48 object-cover"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
        <h3 className="text-lg font-semibold">{currentBanner.title}</h3>
        {currentBanner.description && (
          <p className="text-sm opacity-90">{currentBanner.description}</p>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-2 right-2 flex gap-2">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

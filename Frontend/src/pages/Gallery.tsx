import React, { useState, useRef, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowLeftRight, Info } from 'lucide-react';

interface Case {
  id: number;
  condition: string;
  severity: string;
  severityColor: string;
  description: string;
  before: string;
  after: string;
  details: string[];
}

const cases: Case[] = [
  {
    id: 1,
    condition: 'Micrognathia',
    severity: 'Moderate',
    severityColor: 'bg-blue-100 text-blue-700',
    description: 'Underdevelopment of the lower jaw (mandible) resulting in a recessed chin and misaligned bite. The GAN model reconstructed the expected post-surgical jaw profile.',
    before: '/images/before/1.png',
    after: '/images/after/1.png',
    details: ['Lower jaw recession', 'Class II malocclusion', 'Mandibular advancement surgery'],
  },
  {
    id: 2,
    condition: 'Macrognathia',
    severity: 'Severe',
    severityColor: 'bg-red-100 text-red-700',
    description: 'Abnormal enlargement of the lower jaw causing protrusion beyond the normal facial profile. GAN restoration shows the corrected facial balance post-osteotomy.',
    before: '/images/before/22.png',
    after: '/images/after/22.png',
    details: ['Mandibular protrusion', 'Class III malocclusion', 'Sagittal split osteotomy'],
  },
];

interface SliderProps {
  before: string;
  after: string;
  condition: string;
}

const BeforeAfterSlider: React.FC<SliderProps> = ({ before, after, condition }) => {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  }, []);

  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) updatePos(e.clientX);
    },
    [isDragging, updatePos]
  );

  const onMouseUp = () => setIsDragging(false);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePos(e.touches[0].clientX);
    },
    [updatePos]
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-xl select-none cursor-col-resize"
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* After image (full width, bottom layer) */}
      <img
        src={after}
        alt={`${condition} after`}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* Before image (clipped to left side) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={before}
          alt={`${condition} before`}
          className="absolute inset-0 h-full object-cover"
          style={{ width: `${100 / (sliderPos / 100)}%`, maxWidth: 'none' }}
          draggable={false}
        />
      </div>

      {/* Labels */}
      <div className="absolute top-3 left-3 bg-black/60 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
        BEFORE
      </div>
      <div className="absolute top-3 right-3 bg-primary/80 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
        AFTER
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.5)]"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Drag handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center cursor-col-resize z-10 border-2 border-primary/30"
        style={{ left: `${sliderPos}%` }}
        onMouseDown={onMouseDown}
        onTouchMove={onTouchMove}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <ArrowLeftRight className="h-4 w-4 text-primary" />
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  return (
    <div className="min-h-screen py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-primary bg-primary/10 rounded-full px-4 py-1 mb-4">
            Before &amp; After
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            GAN Restoration Gallery
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Drag the slider on each case to compare the original X-ray with the AI-generated post-surgery restoration.
          </p>

          <div className="inline-flex items-center gap-2 mt-6 text-sm text-muted-foreground bg-secondary/60 rounded-lg px-4 py-2">
            <Info className="h-4 w-4 text-primary flex-shrink-0" />
            These are AI-generated visualizations for educational purposes and do not constitute medical advice.
          </div>
        </div>

        {/* Cases */}
        <div className="space-y-16">
          {cases.map((c) => (
            <div key={c.id} className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Slider */}
              <div>
                <BeforeAfterSlider before={c.before} after={c.after} condition={c.condition} />
                <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
                  <ArrowLeftRight className="h-3.5 w-3.5" />
                  Drag the handle to compare before &amp; after
                </p>
              </div>

              {/* Info */}
              <div className="space-y-5 lg:pt-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-2xl font-bold text-foreground">Case #{c.id} — {c.condition}</h2>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${c.severityColor}`}>
                    {c.severity}
                  </span>
                </div>

                <p className="text-muted-foreground leading-relaxed">{c.description}</p>

                <div className="border border-border rounded-xl p-5 bg-secondary/30 space-y-3">
                  <p className="text-sm font-semibold text-foreground uppercase tracking-wide">Clinical Notes</p>
                  <ul className="space-y-2">
                    {c.details.map((d, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="w-6 h-6 flex-shrink-0 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-border p-4 text-center bg-background">
                    <p className="text-xs text-muted-foreground mb-1">Model Used</p>
                    <p className="font-semibold text-foreground text-sm">GAN Restoration</p>
                  </div>
                  <div className="rounded-xl border border-border p-4 text-center bg-background">
                    <p className="text-xs text-muted-foreground mb-1">CNN Confidence</p>
                    <p className="font-semibold text-primary text-sm">
                      {c.id === 1 ? '93.4%' : '91.7%'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;

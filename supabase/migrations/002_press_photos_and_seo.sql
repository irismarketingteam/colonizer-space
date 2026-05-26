-- Add SEO keyword column to articles
ALTER TABLE articles ADD COLUMN IF NOT EXISTS seo_keyword TEXT;

-- Press photo library
CREATE TABLE IF NOT EXISTS press_photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT,
  credit TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  mission TEXT,
  vehicle TEXT,
  width INTEGER,
  height INTEGER,
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS press_photos_brand ON press_photos(brand);
CREATE INDEX IF NOT EXISTS press_photos_tags ON press_photos USING gin(tags);

ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read press photos" ON press_photos FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Auth all press photos" ON press_photos FOR ALL USING (auth.role() = 'authenticated');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

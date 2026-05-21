-- Core content table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  section TEXT NOT NULL CHECK (section IN (
    'moon','mars','orbit','rockets','tech','economy','players','opinion'
  )),
  body_md TEXT NOT NULL,
  body_html TEXT,
  excerpt TEXT,
  cover_image_url TEXT,
  cover_image_alt TEXT,
  cover_image_credit TEXT,
  author TEXT DEFAULT 'Colonizer Staff',
  status TEXT DEFAULT 'draft' CHECK (status IN (
    'draft','review','scheduled','published','archived'
  )),
  seo_title TEXT,
  seo_description TEXT,
  seo_keyword TEXT,
  tags TEXT[] DEFAULT '{}',
  source_urls TEXT[] DEFAULT '{}',
  reading_time_min INTEGER,
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Full-text search index
CREATE INDEX articles_fts ON articles USING gin(
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(body_md,''))
);

-- Section + status index for listing pages
CREATE INDEX articles_section_status ON articles(section, status, published_at DESC);

-- Pipeline tracking
CREATE TABLE pipeline_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source_url TEXT,
  source_title TEXT,
  source_domain TEXT,
  discovered_at TIMESTAMPTZ DEFAULT NOW(),
  relevance_score FLOAT,
  filter_reasoning TEXT,
  article_id UUID REFERENCES articles(id),
  status TEXT DEFAULT 'discovered' CHECK (status IN (
    'discovered','filtered_out','queued','drafting','drafted','review','published'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Press photo library (brand media kits)
CREATE TABLE press_photos (
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

CREATE INDEX press_photos_brand ON press_photos(brand);
CREATE INDEX press_photos_tags ON press_photos USING gin(tags);

ALTER TABLE press_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read press photos" ON press_photos
  FOR SELECT USING (true);
CREATE POLICY "Auth all press photos" ON press_photos
  FOR ALL USING (auth.role() = 'authenticated');

-- Newsletter subscribers
CREATE TABLE subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','unsubscribed','bounced')),
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

-- Site settings / feature flags
CREATE TABLE site_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row-level security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published" ON articles
  FOR SELECT USING (status = 'published' AND published_at <= NOW());
CREATE POLICY "Auth all" ON articles
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE pipeline_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Auth all pipeline" ON pipeline_runs
  FOR ALL USING (auth.role() = 'authenticated');

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Insert subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Auth read subscribers" ON subscribers
  FOR SELECT USING (auth.role() = 'authenticated');

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER articles_updated BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER pipeline_updated BEFORE UPDATE ON pipeline_runs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

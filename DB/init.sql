-- db/init.sql
-- crea extensiones útiles para búsqueda
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- BORRAR si ya existen (útil en desarrollo)
DROP TABLE IF EXISTS tbl_document_tags CASCADE;
DROP TABLE IF EXISTS tbl_favorites CASCADE;
DROP TABLE IF EXISTS tbl_downloads CASCADE;
DROP TABLE IF EXISTS tbl_comments CASCADE;
DROP TABLE IF EXISTS tbl_documents CASCADE;
DROP TABLE IF EXISTS tbl_tags CASCADE;
DROP TABLE IF EXISTS tbl_categories CASCADE;
DROP TABLE IF EXISTS tbl_account_deletion_requests CASCADE;
DROP TABLE IF EXISTS tbl_moderation_logs CASCADE;
DROP TABLE IF EXISTS tbl_roles CASCADE;
DROP TABLE IF EXISTS tbl_usuario CASCADE;

-- ROLES
CREATE TABLE tbl_roles (
  role_id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE
);

-- USUARIOS (perfil local; autenticación con Firebase)
CREATE TABLE tbl_usuario (
  user_id SERIAL PRIMARY KEY,
  firebase_uid VARCHAR(128) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(200),
  profile_image_url TEXT,
  role_id INTEGER REFERENCES tbl_roles(role_id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- CATEGORIAS
CREATE TABLE tbl_categories (
  category_id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL UNIQUE,
  slug VARCHAR(150) NOT NULL UNIQUE
);

-- TAGS
CREATE TABLE tbl_tags (
  tag_id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

-- DOCUMENTOS
CREATE TABLE tbl_documents (
  document_id SERIAL PRIMARY KEY,
  title VARCHAR(300) NOT NULL,
  description TEXT,
  author_id INTEGER REFERENCES tbl_usuario(user_id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES tbl_categories(category_id) ON DELETE SET NULL,
  storage_url TEXT NOT NULL,
  file_name VARCHAR(300),
  file_size BIGINT,
  content_type VARCHAR(100),
  publish_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_public BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Relación M:N documentos - tags
CREATE TABLE tbl_document_tags (
  document_id INTEGER NOT NULL REFERENCES tbl_documents(document_id) ON DELETE CASCADE,
  tag_id INTEGER NOT NULL REFERENCES tbl_tags(tag_id) ON DELETE CASCADE,
  PRIMARY KEY (document_id, tag_id)
);

-- COMENTARIOS
CREATE TABLE tbl_comments (
  comment_id BIGSERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES tbl_documents(document_id) ON DELETE CASCADE,
  author_id INTEGER REFERENCES tbl_usuario(user_id) ON DELETE SET NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_deleted BOOLEAN DEFAULT FALSE
);

-- HISTORIAL DE DESCARGAS
CREATE TABLE tbl_downloads (
  download_id BIGSERIAL PRIMARY KEY,
  document_id INTEGER REFERENCES tbl_documents(document_id) ON DELETE CASCADE,
  user_id INTEGER REFERENCES tbl_usuario(user_id) ON DELETE SET NULL,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- FAVORITOS / "ME GUSTA"
CREATE TABLE tbl_favorites (
  user_id INTEGER REFERENCES tbl_usuario(user_id) ON DELETE CASCADE,
  document_id INTEGER REFERENCES tbl_documents(document_id) ON DELETE CASCADE,
  favorited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  PRIMARY KEY (user_id, document_id)
);

-- SOLICITUDES DE ELIMINACION DE CUENTA
CREATE TABLE tbl_account_deletion_requests (
  request_id BIGSERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES tbl_usuario(user_id) ON DELETE CASCADE,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  processed_by INTEGER REFERENCES tbl_usuario(user_id),
  processed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'pending'
);

-- LOGS DE MODERACION / AUDIT
CREATE TABLE tbl_moderation_logs (
  log_id BIGSERIAL PRIMARY KEY,
  actor_user_id INTEGER REFERENCES tbl_usuario(user_id),
  target_table VARCHAR(100),
  target_id BIGINT,
  action VARCHAR(50),
  detail TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- INDICES (sugeridos)
CREATE INDEX IF NOT EXISTS idx_documents_category ON tbl_documents(category_id);
CREATE INDEX IF NOT EXISTS idx_documents_author ON tbl_documents(author_id);
CREATE INDEX IF NOT EXISTS idx_documents_publish_date ON tbl_documents(publish_date);
CREATE INDEX IF NOT EXISTS idx_downloads_user ON tbl_downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON tbl_favorites(user_id);

-- Full text (columna tsv)
ALTER TABLE tbl_documents
  ADD COLUMN IF NOT EXISTS tsv tsvector;

UPDATE tbl_documents SET tsv = to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(description,''));
CREATE INDEX IF NOT EXISTS idx_documents_tsv ON tbl_documents USING GIN (tsv);

-- Trigger para actualizar tsv y updated_at automáticamente al insertar/actualizar documento
CREATE OR REPLACE FUNCTION tbl_documents_tsv_trigger() RETURNS trigger AS $$
begin
  NEW.tsv := to_tsvector('spanish', coalesce(NEW.title,'') || ' ' || coalesce(NEW.description,''));
  NEW.updated_at := now();
  return NEW;
end
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_documents_tsv ON tbl_documents;
CREATE TRIGGER trg_documents_tsv
BEFORE INSERT OR UPDATE ON tbl_documents
FOR EACH ROW EXECUTE FUNCTION tbl_documents_tsv_trigger();

-- Trigger para actualizar updated_at en comentarios
CREATE OR REPLACE FUNCTION update_timestamp_column() RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_comments_updated_at ON tbl_comments;
CREATE TRIGGER trg_comments_updated_at
BEFORE INSERT OR UPDATE ON tbl_comments
FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

INSERT INTO roles (id, nombre) VALUES 
(1, 'ADMIN'),
(2, 'USER')
ON CONFLICT (id) DO NOTHING;

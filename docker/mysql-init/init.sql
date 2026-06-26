CREATE TABLE IF NOT EXISTS app_ping (
  id INT NOT NULL AUTO_INCREMENT,
  label VARCHAR(50) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uk_app_ping_label (label)
);

INSERT INTO app_ping (label)
SELECT 'ready'
WHERE NOT EXISTS (
  SELECT 1 FROM app_ping WHERE label = 'ready'
);

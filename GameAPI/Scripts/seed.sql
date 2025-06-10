-- SQLite 
INSERT INTO Games (Id, Title, ReleaseYear, Type, Studio, PriceOnLaunch, ImageUrl)
VALUES 
(1, 'Dummy Game', 2023, 'Adventure', 'My Studio', 59.99, NULL),
(2, 'Dummy Game', 2023, 'Adventure', 'My Studio', 59.99, NULL),
(3, 'Dummy Game', 2023, 'Adventure', 'My Studio', 59.99, NULL);

INSERT INTO Tags (Name) VALUES
('Adventure'),
('RPG'),
('Action');

DELETE FROM Games WHERE Title = "Dummy Game";

DELETE FROM Users WHERE Username = "admin";
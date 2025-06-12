// src/pages/AdminGamesPage/AdminGamesPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { gameService } from '../../services/GameService';
import type { GameReadDto } from '../../types/api';
import { formatPrice } from '../../utils/formatting';

//Test comment to verify activity for portfolio site

const formatHeader = (key: string): string => {
    if (key === 'id') return 'ID';
    const withSpaces = key.replace(/([A-Z])/g, ' $1');
    return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
};

const AdminGamesPage = () => {
    const [games, setGames] = useState<GameReadDto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            window.history.replaceState({}, document.title);
        }

        const fetchGames = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const fetchedGames = await gameService.getAllGames();
                setGames(fetchedGames);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch games');
            } finally {
                setIsLoading(false);
            }
        };
        fetchGames();
    }, [location.state]);

    const handleDelete = async (gameId: number) => {
        if (window.confirm(`Are you sure you want to delete game with ID ${gameId}?`)) {
            try {
                await gameService.deleteGame(gameId);
                setGames(currentGames => currentGames.filter(game => game.id !== gameId));
                setSuccessMessage('Game deleted successfully.');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to delete game');
            }
        }
    };

    const dataKeys: (keyof GameReadDto)[] = ['id', 'title', 'studio', 'releaseYear', 'priceOnLaunch', 'tags'];
    const actionKeys = ['actions'];
    const allColumnKeys = [...dataKeys, ...actionKeys];

    const renderCellContent = (game: GameReadDto, key: string) => {
        if (key === 'actions') {
            return (
                <>
                    <Link to={`/admin/games/edit/${game.id}`}>
                        <button style={{ marginRight: '8px' }}>Edit</button>
                    </Link>
                    <button onClick={() => handleDelete(game.id)}>Delete</button>
                </>
            );
        }

        if (key === 'priceOnLaunch') {
            return formatPrice(game.priceOnLaunch);
        }

        const value = game[key as keyof GameReadDto];
        if (Array.isArray(value)) {
            return value.map(item => item.name).join(', ');
        }
        return value === null || value === undefined ? '' : String(value);
    };

    if (isLoading) return <div>Loading games...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h2>Manage Games</h2>
                <Link to="/admin/games/create">
                    <button style={{ padding: '8px 16px', cursor: 'pointer' }}>Create New Game</button>
                </Link>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>}
            {successMessage && <div style={{ color: 'green', marginBottom: '1rem' }}>{successMessage}</div>}

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid black' }}>
                        {allColumnKeys.map((key) => (
                            <th key={key} style={{ textAlign: 'left', padding: '8px' }}>{formatHeader(key)}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {games.length === 0 ? (
                        <tr>
                            <td colSpan={allColumnKeys.length} style={{ textAlign: 'center', padding: '1rem' }}>No games found.</td>
                        </tr>
                    ) : (
                        games.map((game) => (
                            <tr key={game.id} style={{ borderBottom: '1px solid #ccc' }}>
                                {allColumnKeys.map((key) => (
                                    <td key={`${game.id}-${key}`} style={{ padding: '8px' }}>{renderCellContent(game, key)}</td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminGamesPage;
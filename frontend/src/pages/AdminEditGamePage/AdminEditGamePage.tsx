import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { gameService } from '../../services/GameService';
import { tagService } from '../../services/TagService';
import type { GameUpdateDto, TagReadDto } from '../../types/api';

type GameFormState = Omit<GameUpdateDto, 'releaseYear' | 'priceOnLaunch'> & {
    releaseYear: string;
    priceOnLaunch: string;
};

const AdminEditGamePage = () => {
    const navigate = useNavigate();
    const { gameId } = useParams<{ gameId: string }>();

    const [formData, setFormData] = useState<Partial<GameFormState>>({});
    const [allTags, setAllTags] = useState<TagReadDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [originalTitle, setOriginalTitle] = useState('');

    useEffect(() => {
        if (!gameId) {
            navigate('/admin/games');
            return;
        }

        const fetchDataForEdit = async () => {
            try {
                const [gameData, tagsData] = await Promise.all([
                    gameService.getGameById(parseInt(gameId)),
                    tagService.getAllTags()
                ]);

                setOriginalTitle(gameData.title);
                setAllTags(tagsData);

                setFormData({
                    title: gameData.title,
                    description: gameData.description,
                    releaseYear: gameData.releaseYear.toString(),
                    type: gameData.type,
                    studio: gameData.studio,
                    priceOnLaunch: gameData.priceOnLaunch.toString(),
                    imageUrl: gameData.imageUrl,
                    tagIds: gameData.tags.map(tag => tag.id)
                });
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load game data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDataForEdit();
    }, [gameId, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (tagId: number) => {
        setFormData(prev => {
            const currentTagIds = prev.tagIds || [];
            if (currentTagIds.includes(tagId)) {
                return { ...prev, tagIds: currentTagIds.filter(id => id !== tagId) };
            } else {
                return { ...prev, tagIds: [...currentTagIds, tagId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!gameId) return;
        setError(null);

        const releaseYearNum = parseInt(formData.releaseYear || '', 10);
        const priceNum = parseFloat(formData.priceOnLaunch || '');

        if (!formData.title) { setError("Title is required."); return; }
        if (isNaN(priceNum)) { setError("Price must be a valid number."); return; }

        setIsLoading(true);

        const dataToSubmit: GameUpdateDto = {
            title: formData.title,
            description: formData.description,
            releaseYear: releaseYearNum,
            type: formData.type,
            studio: formData.studio,
            priceOnLaunch: priceNum,
            imageUrl: formData.imageUrl,
            tagIds: formData.tagIds,
        };

        try {
            await gameService.patchGame(parseInt(gameId), dataToSubmit);
            navigate('/admin/games', { state: { message: `Game '${dataToSubmit.title}' updated successfully!` } });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update game.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) return <div>Loading game for editing...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div>
            <h1>Edit Game: {originalTitle}</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div><label htmlFor="title">Title</label><input type="text" id="title" name="title" value={formData.title || ''} onChange={handleChange} required disabled={isLoading} /></div>
                <div><label htmlFor="description">Description</label><textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} disabled={isLoading} /></div>
                <div><label htmlFor="releaseYear">Release Year</label><input type="number" id="releaseYear" name="releaseYear" value={formData.releaseYear || ''} onChange={handleChange} required disabled={isLoading} /></div>
                <div><label htmlFor="type">Type</label><input type="text" id="type" name="type" value={formData.type || ''} onChange={handleChange} required disabled={isLoading} /></div>
                <div><label htmlFor="studio">Studio</label><input type="text" id="studio" name="studio" value={formData.studio || ''} onChange={handleChange} disabled={isLoading} /></div>
                <div><label htmlFor="priceOnLaunch">Price on Launch (€)</label><input type="number" id="priceOnLaunch" name="priceOnLaunch" value={formData.priceOnLaunch || 'Free'} onChange={handleChange} step="0.01" required disabled={isLoading} /></div>
                <div><label htmlFor="imageUrl">Image URL</label><input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={isLoading} /></div>

                <fieldset disabled={isLoading}>
                    <legend>Tags</legend>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                        {allTags.map((tag: TagReadDto) => (
                            <div key={tag.id}>
                                <input
                                    type="checkbox"
                                    id={`tag-edit-${tag.id}`}
                                    checked={formData.tagIds?.includes(tag.id) || false}
                                    onChange={() => handleTagChange(tag.id)}
                                />
                                <label htmlFor={`tag-edit-${tag.id}`}>{tag.name}</label>
                            </div>
                        ))}
                    </div>
                </fieldset>

                {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate('/admin/games')} disabled={isLoading}>Cancel</button>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </form>
        </div>
    );
};

export default AdminEditGamePage;
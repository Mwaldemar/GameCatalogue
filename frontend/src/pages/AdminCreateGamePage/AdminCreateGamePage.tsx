import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameService } from '../../services/GameService';
import { tagService } from '../../services/TagService';
import type { GameCreateDto, TagReadDto } from '../../types/api';

type GameFormState = Omit<GameCreateDto, 'releaseYear' | 'priceOnLaunch'> & {
    releaseYear: string;
    priceOnLaunch: string;
};

const CreateGamePage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<GameFormState>({
        title: '',
        description: '',
        releaseYear: '',
        type: '',
        studio: '',
        priceOnLaunch: '',
        imageUrl: '',
        tagIds: [],
    });

    const [allTags, setAllTags] = useState<TagReadDto[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTags = async () => {
            setIsLoading(true);
            try {
                const tags = await tagService.getAllTags();
                setAllTags(tags);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
                setError(`Error loading tags: ${errorMessage}. Please try refreshing the page.`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTags();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTagChange = (tagId: number) => {
        setFormData(prev => {
            const currentTagIds = prev.tagIds;
            if (currentTagIds.includes(tagId)) {
                return { ...prev, tagIds: currentTagIds.filter(id => id !== tagId) };
            } else {
                return { ...prev, tagIds: [...currentTagIds, tagId] };
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        const releaseYearNum = parseInt(formData.releaseYear, 10);
        const priceNum = parseFloat(formData.priceOnLaunch);

        if (formData.priceOnLaunch.trim() === '' || isNaN(priceNum)) {
            setError('Price on Launch is required and must be a number.');
            return;
        }
        if (formData.releaseYear.trim() === '' || isNaN(releaseYearNum)) {
            setError('Release Year is required and must be a number.');
            return;
        }
        if (formData.tagIds.length === 0) {
            setError("Please select at least one tag.");
            return;
        }

        setIsLoading(true);

        const dataToSubmit: GameCreateDto = {
            ...formData,
            releaseYear: releaseYearNum,
            priceOnLaunch: priceNum,
        };

        try {
            await gameService.createGame(dataToSubmit);
            navigate('/admin/games', { replace: true });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred.';
            setError(`Failed to create game: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && allTags.length === 0) {
        return <div>Loading form...</div>;
    }

    return (
        <div>
            <h1>Create New Game</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div>
                    <label htmlFor="title">Title</label>
                    <input type="text" id="title" name="title" value={formData.title} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="description">Description</label>
                    <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="releaseYear">Release Year</label>
                    <input type="number" id="releaseYear" name="releaseYear" value={formData.releaseYear} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="priceOnLaunch">Price on Launch (€)</label>
                    <input type="number" id="priceOnLaunch" name="priceOnLaunch" value={formData.priceOnLaunch} onChange={handleChange} step="0.01" placeholder="e.g. 59.99" required disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="type">Type</label>
                    <input type="text" id="type" name="type" value={formData.type} onChange={handleChange} required disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="studio">Studio</label>
                    <input type="text" id="studio" name="studio" value={formData.studio || ''} onChange={handleChange} disabled={isLoading} />
                </div>
                <div>
                    <label htmlFor="imageUrl">Image URL</label>
                    <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" disabled={isLoading} />
                </div>

                <fieldset disabled={isLoading}><legend>Tags</legend><div>{allTags.length > 0 ? allTags.map(tag => (<div key={tag.id}><input type="checkbox" id={`tag-${tag.id}`} checked={formData.tagIds.includes(tag.id)} onChange={() => handleTagChange(tag.id)} /><label htmlFor={`tag-${tag.id}`}>{tag.name}</label></div>)) : <p>No tags could be loaded.</p>}</div></fieldset>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div style={{ marginTop: '20px' }}>
                    <button type="button" onClick={() => navigate('/admin/games')} disabled={isLoading}>Cancel</button>
                    <button type="submit" disabled={isLoading}>{isLoading ? 'Saving...' : 'Create Game'}</button>
                </div>
            </form>
        </div>
    );
};

export default CreateGamePage;
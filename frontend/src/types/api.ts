// ===================================================================
// Typer relateret til Tags
// ===================================================================

/** Data vi modtager, når vi læser et tag fra API'et. */
export interface TagReadDto {
  id: number;
  name: string;
}

/** Data vi sender, når vi vil oprette et nyt tag. */
export interface TagCreateDto {
  name: string;
}

// ===================================================================
// Typer relateret til Games
// ===================================================================

/** Data vi modtager, når vi læser et spil fra API'et. */
export interface GameReadDto {
  id: number;
  title: string;
  releaseYear: number;
  type: string;
  studio?: string; // Valgfri (nullable i C#)
  priceOnLaunch: number; // decimal/double/int bliver til 'number'
  imageUrl?: string;
  tags: TagReadDto[];
}

/** Data vi sender, når vi vil oprette et nyt spil. */
export interface GameCreateDto {
  title: string;
  releaseYear: number;
  type: string;
  studio?: string;
  priceOnLaunch: number;
  imageUrl?: string;
  tagIds: number[];
}

/** Data vi sender, når vi vil opdatere et spil (alle felter er valgfrie). */
export interface GameUpdateDto {
  title?: string;
  releaseYear?: number;
  type?: string;

  studio?: string;
  priceOnLaunch?: number;
  imageUrl?: string;
  tagIds?: number[];
}

// ===================================================================
// Typer relateret til Reviews
// =_=================================================================

/** Data vi modtager, når vi læser en anmeldelse. */
export interface ReviewReadDto {
  id: number;
  title: string;
  content: string;
  rating: number;
  createdAt: string; // DateTime bliver til en ISO-streng i JSON
  username: string;
}

/** Data vi sender, når vi vil oprette en ny anmeldelse. */
export interface ReviewCreateDto {
  title: string;
  content: string;
  rating: number;
}

/** Data vi sender, når vi vil opdatere en anmeldelse. */
export interface ReviewUpdateDto {
  title?: string;
  content?: string;
  rating?: number;
}


// ===================================================================
// Typer relateret til Users & Authentication
// ===================================================================

/** Data vi modtager, når vi læser en brugers offentlige profil. */
export interface UserReadDto {
  id: number;
  username: string;
  role: string;
}

/** Data vi sender for at logge ind. */
export interface LoginDto {
  username: string;
  password: string;
}

/** Data vi sender for at registrere en ny bruger. */
export interface UserDto {
  username: string;
  password: string;
  role: string;
}

/** Data vi modtager fra API'et efter et succesfuldt login. */
export interface AuthResponseDto {
  token: string;
  username: string;
  role: string;
}
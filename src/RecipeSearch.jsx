import React, {useState, useEffect} from 'react';

function RecipeSearch() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const apiKey = 'b2a406f79f034c2f85c5bbc753aad411';

  useEffect(() => {
    const fetchData = async () => {
        try {
            const endpoint = `https://api.spoonacular.com/recipes/complexSearch?apiKey=${apiKey}&query=pasta`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
              }
            const data = await response.json();
            setRecipes(data.results); 
        }
        catch (error) {
            setError(error);
            
        }
        finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <h1>Recipes</h1>
      <ul>
        {recipes.map(recipe => (
          <li key={recipe.id}>
            {recipe.title}
            <img src={recipe.image} alt={recipe.title} />
          </li>
        ))}
      </ul>
    </div>
  );

}

export default RecipeSearch;
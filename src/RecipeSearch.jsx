import React, {useState, useEffect} from 'react';
import './RecipeSearch.css';

function RecipeSearch() {
  const [meals, setMeals] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const apiKey = '1';

  const countIngredients = (meal) => {
    let count = 0;
    for(let i = 1; i <= 30; i++) {
        const ing = meal[`strIngredient${i}`];
        if (ing && ing.trim() !== "") {
            count++;
        } 
    }
    return count;
  }

  useEffect(() => {
    const fetchData = async () => {
        try {
            const endpoint = `https://www.themealdb.com/api/json/v1/1/search.php?f=g`;
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setMeals(data.meals); 
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

  const mean = (numbers) => {
    const total = numbers.reduce((acc, c) => acc + c, 0);
    return total / numbers.length;
  };

  const mode = (numbers) => {
    const counts = {};
    numbers.forEach((number) => {
        counts[number] = (counts[number] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(counts));
    return Object.keys(counts).filter((k) => counts[k] === maxCount);
  };

  function dataRange(arr) {
    return Math.max(...arr) - Math.min(...arr);
}

  const filteredMeals = meals?.filter(meal =>
    meal.strMeal.toUpperCase().includes(searchTerm.toUpperCase())
  );

  const ingredientCounts = filteredMeals?.map(meal => countIngredients(meal));
  return (
    <div>
    <input 
        type="text"
        placeholder="Search for a specific meal!"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
       <div>
        Total # of Meals: {meals?.length} <br/>
        Displaying: {filteredMeals?.length} meals <br/>
        Mean of No. of Ingredients: {ingredientCounts && mean(ingredientCounts).toFixed(2)} <br/>
        Mode of No. of Ingredients: {ingredientCounts && mode(ingredientCounts).join(', ')} <br/>
        Range of No. of Ingredients: {ingredientCounts && dataRange(ingredientCounts)}
      </div>

      {filteredMeals && ( 
        <table>
            <thead>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>No. of Ingredients</th>
            </thead>
        <tbody>
        {filteredMeals.map(meal => (
                <tr key={meal.idMeal}>
                    <td>
                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                    </td>
                    <td>{meal.strMeal}</td>
                    <td>{meal.strCategory}</td>
                    <td>{countIngredients(meal)}</td>
                </tr>
            ))}
        </tbody>
        </table>
      )}
    </div>
  );
}

export default RecipeSearch;

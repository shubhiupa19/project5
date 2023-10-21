import React, {useState, useEffect} from 'react';
import './RecipeSearch.css';

function RecipeSearch() {
  const [meals, setMeals] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
 const [categories, setCategories] = useState([]);
 const [selectedAreas, setSelectedAreas] = useState([]);
 const [areas, setAreas] = useState([]);

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
    const fetchAreas = async () => {
        try {
            const response = await fetch ('https://www.themealdb.com/api/json/v1/1/list.php?a=list');
            const data = await response.json();
            setAreas(data.meals);
        } catch (err) {
            console.error('Failed to fetch areas', err);
        }

    };
    fetchAreas();

  }, []);
  useEffect(() => { 
    const fetchCategories = async () => {
        try {
            const response = await fetch ('https://www.themealdb.com/api/json/v1/1/list.php?c=list');
            const data = await response.json();
            setCategories(data.meals);
        } catch (err) {
            console.error('Failed to fetch categories', err);
        }

    };

    fetchCategories();

  }, []);
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
    (selectedCategory === 'All' || meal.strCategory === selectedCategory) 
    && (selectedAreas.length === 0 || selectedAreas.includes(meal.strArea)) 
    && meal.strMeal.toUpperCase().includes(searchTerm.toUpperCase())
);


  const ingredientCounts = filteredMeals?.map(meal => countIngredients(meal));
  return (
    <div>
    <div className="search-controls">
    <input 
        type="text"
        placeholder="Search for a specific meal!"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <label htmlFor="categorySelect">Category:</label>
      <select id="categorySelect" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="All">All Categories</option>
                {categories.map(cat => <option key={cat.strCategory} value={cat.strCategory}>{cat.strCategory}</option>)}
        </select>
        <div className = "areas-wrapper">
        <label htmlFor="areaSelect">Areas:</label>
        <select id = "areaSelect" multiple value = {selectedAreas} onChange={(e) => {
            const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
            setSelectedAreas(selectedOptions);
        }}>
            {areas.map(area => <option key={area.strArea} value={area.strArea}>{area.strArea}</option>)}
        </select>
        
        <button onClick={() => setSelectedAreas([])}>Unselect All</button>
        </div>
    </div>
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
            <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Area</th>
            <th>No. of Ingredients</th>
            
            </tr>
            </thead>
        <tbody>
        {filteredMeals.map(meal => (
                <tr key={meal.idMeal}>
                    <td>
                    <img src={meal.strMealThumb} alt={meal.strMeal} />
                    </td>
                    <td>{meal.strMeal}</td>
                    <td>{meal.strCategory}</td>
                    <td>{meal.strArea}</td>
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

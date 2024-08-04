-- Update gluten free and vegan options
UPDATE Menu_Items AS m
SET vegetarian = TRUE
WHERE NOT EXISTS (
    SELECT mi.Menu_Item_Name
    FROM Menu_Item_Ingredients AS mi
    LEFT JOIN Ingredients AS i ON mi.Ingredient_Name = i.ingredient_name
    WHERE mi.Menu_Item_Name = m.Item_Name
    AND i.vegetarian = FALSE
);

UPDATE Menu_Items AS m
SET glutenfree = TRUE
WHERE NOT EXISTS (
    SELECT mi.Menu_Item_Name
    FROM Menu_Item_Ingredients AS mi
    LEFT JOIN Ingredients AS i ON mi.Ingredient_Name = i.ingredient_name
    WHERE mi.Menu_Item_Name = m.Item_Name
    AND i.glutenfree = FALSE
);
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { cookies } from 'next/headers';
import ZAI from 'z-ai-web-dev-sdk';

// Helper functions
function normalizeItems(rawInput: string): string[] {
  return rawInput
    .toLowerCase()
    .split(/[,;\n]+/)
    .map(item => item.trim())
    .filter(Boolean);
}

function guessCuisine(items: string[]): string {
  const itemSet = new Set(items);
  
  if (itemSet.has('paneer') || itemSet.has('turmeric') || itemSet.has('cumin') || itemSet.has('curry')) {
    return 'indian';
  }
  if (itemSet.has('pasta') || itemSet.has('basil') || itemSet.has('parmesan') || itemSet.has('mozzarella')) {
    return 'italian';
  }
  if (itemSet.has('soy sauce') || itemSet.has('ginger') || itemSet.has('sesame')) {
    return 'chinese';
  }
  if (itemSet.has('lime') || itemSet.has('cilantro') || itemSet.has('tortilla')) {
    return 'mexican';
  }
  if (itemSet.has('olive oil') || itemSet.has('feta') || itemSet.has('lemon')) {
    return 'mediterranean';
  }
  
  return 'fusion';
}

function titleCase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function round(value: number, decimals = 0): number {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
}

// POST - Generate recipe using AI
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      ingredients: ingredientsRaw,
      diet = 'none',
      cuisine: cuisineSelect = 'auto',
      minutes = 25,
      servings = 2,
      targetCalories = 450,
      spiceLevel = 'medium'
    } = body;

    if (!ingredientsRaw) {
      return NextResponse.json({ error: 'Ingredients are required' }, { status: 400 });
    }

    const items = normalizeItems(ingredientsRaw);
    
    if (items.length < 2) {
      return NextResponse.json({ error: 'Please add at least 2 ingredients' }, { status: 400 });
    }

    const cuisine = cuisineSelect === 'auto' ? guessCuisine(items) : cuisineSelect;

    // Try to use AI for recipe generation
    try {
      const zai = await ZAI.create();
      
      const prompt = `You are an expert chef specializing in ${cuisine} cuisine. Create a detailed recipe using these ingredients: ${items.join(', ')}.

Requirements:
- Diet preference: ${diet === 'none' ? 'No restrictions' : diet}
- Cooking time: ${minutes} minutes
- Servings: ${servings}
- Target calories per serving: ${targetCalories} kcal
- Spice level: ${spiceLevel}

Provide the recipe in this exact JSON format:
{
  "title": "Recipe Name",
  "description": "Brief description",
  "ingredients": [
    {"name": "ingredient name", "quantity": "amount with unit"}
  ],
  "steps": ["step 1", "step 2", ...],
  "nutrition": {
    "calories": number,
    "protein": number (grams),
    "carbs": number (grams),
    "fats": number (grams),
    "fiber": number (grams)
  },
  "tips": ["tip 1", "tip 2"],
  "benefits": ["health benefit 1", "health benefit 2"]
}

Only return the JSON, no other text.`;

      const completion = await zai.chat.completions.create({
        messages: [
          { role: 'system', content: 'You are a professional chef AI that creates healthy, delicious recipes. Always respond with valid JSON only.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 2000
      });

      const content = completion.choices[0]?.message?.content;
      
      if (content) {
        // Extract JSON from response
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const recipe = JSON.parse(jsonMatch[0]);
          
          // Validate and format the recipe
          const formattedRecipe = {
            title: recipe.title || `${titleCase(items[0])} ${titleCase(cuisine)} Delight`,
            description: recipe.description || `A delicious ${cuisine} dish made with ${items.slice(0, 3).join(', ')}`,
            cuisine,
            method: cuisine === 'indian' ? 'Traditional' : 'Modern',
            minutes,
            servings,
            ingredients: recipe.ingredients || items.map(item => ({
              name: item,
              quantity: `${round(100 + servings * 20)}g`
            })),
            steps: recipe.steps || ['Prepare ingredients', 'Cook as desired', 'Serve hot'],
            nutrition: {
              calories: recipe.nutrition?.calories || targetCalories,
              protein: recipe.nutrition?.protein || 15,
              carbs: recipe.nutrition?.carbs || 30,
              fats: recipe.nutrition?.fats || 10,
              fiber: recipe.nutrition?.fiber || 5
            },
            tips: recipe.tips || ['Taste and adjust seasoning as needed'],
            benefits: recipe.benefits || ['Rich in nutrients', 'Balanced meal']
          };

          return NextResponse.json({ recipe: formattedRecipe }, { status: 200 });
        }
      }
    } catch {
      // AI failed, generate fallback recipe
    }

    // Fallback recipe generation
    const mainIngredient = items[0];
    const fallbackRecipe = {
      title: `${titleCase(mainIngredient)} ${titleCase(cuisine)} Special`,
      description: `A delightful ${cuisine} preparation using ${items.slice(0, 3).join(', ')}`,
      cuisine,
      method: 'Traditional',
      minutes,
      servings,
      ingredients: items.slice(0, 8).map(item => ({
        name: item,
        quantity: `${round(80 + servings * 15)}g`
      })),
      steps: [
        `Prepare all ingredients: wash and chop ${items.join(', ')}`,
        `Heat oil in a pan over medium heat`,
        `Add ${mainIngredient} and cook for ${Math.round(minutes * 0.4)} minutes`,
        `Add remaining ingredients and spices`,
        `Simmer for ${Math.round(minutes * 0.4)} minutes`,
        `Garnish and serve hot`
      ],
      nutrition: {
        calories: targetCalories,
        protein: round(servings * 8 + items.length * 2),
        carbs: round(servings * 15 + items.length * 5),
        fats: round(servings * 5),
        fiber: round(items.length * 2)
      },
      tips: ['Taste and adjust seasoning as needed', 'Let rest for 2 minutes before serving'],
      benefits: ['Nutritious meal', 'Balanced macros']
    };

    return NextResponse.json({ recipe: fallbackRecipe }, { status: 200 });
  } catch {
    return NextResponse.json({ error: 'Failed to generate recipe' }, { status: 500 });
  }
}

// GET - Get saved recipes
export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ recipes: [] }, { status: 200 });
    }

    const recipes = await db.savedRecipe.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({ recipes }, { status: 200 });
  } catch {
    return NextResponse.json({ recipes: [] }, { status: 200 });
  }
}

// PUT - Save a recipe
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Please login to save recipes' }, { status: 401 });
    }

    const body = await request.json();
    const { title, cuisine, method, minutes, servings, ingredients, steps, nutrition, totalCalories } = body;

    const recipe = await db.savedRecipe.create({
      data: {
        userId,
        title,
        cuisine,
        method,
        minutes,
        servings,
        ingredients: JSON.stringify(ingredients),
        steps: JSON.stringify(steps),
        nutrition: JSON.stringify(nutrition),
        totalCalories
      }
    });

    return NextResponse.json({ recipe, message: 'Recipe saved!' }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to save recipe' }, { status: 500 });
  }
}

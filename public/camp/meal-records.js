export const MEAL_SLOTS={meal:'ごはん',breakfast:'朝ごはん',lunch:'昼ごはん',dinner:'夜ごはん',snack:'おやつ'};
const menus=['curry','bbq','sandwich','noodles','stew','rice'];
export function normalizeMeals(value){return (Array.isArray(value)?value:[]).slice(0,60).filter(m=>m&&menus.includes(m.menu)).map((m,i)=>({id:typeof m.id==='string'&&/^[a-zA-Z0-9-]{1,100}$/.test(m.id)?m.id:'meal-'+i,slot:Object.hasOwn(MEAL_SLOTS,m.slot)?m.slot:'meal',menu:m.menu}));}
export function mealEntries(visit){const list=normalizeMeals(visit.meals);return list.length?list:visit.actions?.meal?[{id:'legacy-meal',slot:'meal',menu:menus.includes(visit.mealMenu)?visit.mealMenu:'curry'}]:[];}
export function addMeal(visit,entry){visit.meals=normalizeMeals([...mealEntries(visit),entry]);visit.mealMenu=entry.menu;}

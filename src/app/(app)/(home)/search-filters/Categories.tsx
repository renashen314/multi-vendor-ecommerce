import { CategoryDropdown } from "./CategoryDropdown";
import { CustomCategory } from "../type";

interface CategoriesProps {
    data: CustomCategory[]
}

export const Categories = ({data}: CategoriesProps) => {
  return (
    <div className="relative w-full">
        <div className="flex flex-nowrap items-center">
        {data.map((category) => (
            <div key={category.id}>
               <CategoryDropdown 
               category={category}
               isActive={false}
               isNavigationHovered={false}
               /> 
            </div>
        ))}
        </div>
    </div>
  )
}


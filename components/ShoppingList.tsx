import React from 'react';
import { ShoppingItem } from '../types';
import { ShoppingBag, Tag } from 'lucide-react';

interface ShoppingListProps {
  items: ShoppingItem[];
}

const ShoppingList: React.FC<ShoppingListProps> = ({ items }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 pb-24">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingBag className="w-5 h-5 text-neutral-500" />
        <h3 className="text-xl font-medium text-neutral-900">Curated Shopping List</h3>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50 border-b border-neutral-200">
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Item Name</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500">Material / Color</th>
                <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-neutral-500 text-right">Est. Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-neutral-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-neutral-900">{item.itemName}</td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                      {item.category}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-neutral-600">{item.recommendation}</td>
                  <td className="py-4 px-6 text-right font-medium text-neutral-900">{item.estimatedPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {items.length === 0 && (
          <div className="p-8 text-center text-neutral-400">
            No recommendations generated.
          </div>
        )}
      </div>
      
      <div className="mt-4 flex items-start gap-2 text-xs text-neutral-400 max-w-2xl">
        <Tag className="w-3 h-3 mt-0.5" />
        <p>Prices are estimates based on current market averages for this style. Actual availability and pricing may vary by retailer.</p>
      </div>
    </div>
  );
};

export default ShoppingList;
